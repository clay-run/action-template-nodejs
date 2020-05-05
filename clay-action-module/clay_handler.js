const { ClayStatus, ClayInternalStatus } = require('./clay_status.js')

/**
 *
 * utility function to remove unnecessary environment variables
 *
 */
function sanctifyEnvVariables() {
  const ENV_VARIABLES = [
    "PATH",
    "LANG",
    "TZ",
    "LD_LIBRARY_PATH",
    "LAMBDA_TASK_ROOT",
    "LAMBDA_RUNTIME_DIR",
    "AWS_REGION",
    "AWS_DEFAULT_REGION",
    "AWS_LAMBDA_LOG_GROUP_NAME",
    "AWS_LAMBDA_LOG_STREAM_NAME",
    "AWS_LAMBDA_FUNCTION_NAME",
    "AWS_LAMBDA_FUNCTION_MEMORY_SIZE",
    "AWS_LAMBDA_FUNCTION_VERSION",
    "_AWS_XRAY_DAEMON_ADDRESS",
    "_AWS_XRAY_DAEMON_PORT",
    "AWS_XRAY_DAEMON_ADDRESS",
    "AWS_XRAY_CONTEXT_MISSING",
    "_X_AMZN_TRACE_ID",
    "AWS_EXECUTION_ENV",
    "_HANDLER",
    "NODE_PATH",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_SESSION_TOKEN"
  ]

  for(const key in process.env) {
    if(ENV_VARIABLES.includes(key)) {
      delete process.env[key]
    }
  }
}

/**
 * 
 * utility function to reload module
 * 
 */
function requireUncached(module){
  delete require.cache[require.resolve(module)]
  return require(module)
}

/**
 * 
 * utility function for the lambda return payload on success
 * 
 */
function clayLambdaResponse(actionOutput, lambdaExecutionStatusMsg, isLambdaExecutionSuccess){
  return {
    stringifiedActionOutput: JSON.stringify(actionOutput),
    lambdaExecutionStatusMsg,
    isLambdaExecutionSuccess,
  }
}

/**
 * 
 * utility class used as action function return type
 * 
 */
class ActionFunctionReturnType {
  constructor(outputData, status, message, textPreview, imagePreview, logInfo){
    this.outputData = outputData
    this.status = status
    this.message = message
    this.textPreview = textPreview
    this.imagePreview = imagePreview
    this.logInfo = logInfo
  }

  getSerializedObject(){
    return {
      outputData: this.outputData,
      status: this.status,
      message: this.message, 
      textPreview: this.textPreview,
      imagePreview: this.imagePreview,
      logInfo: this.logInfo
    }
  }

  static isValidActionFunctionReturn(actionFunctionReturnObject){
    if('data' in actionFunctionReturnObject
      && 'status' in actionFunctionReturnObject
      && 'message' in actionFunctionReturnObject
      && 'textPreview' in actionFunctionReturnObject
      && 'imagePreview' in actionFunctionReturnObject){
        return true
      }
    return false
  }

}

/**
 * 
 * handler function
 * 
 */
async function runLambda(event, context) {
  let isTestMode = false
  if(event.isTestMode === true){
    console.log('DEBUG: running in test mode')
    isTestMode = true
  }

  if(!isTestMode) console.log('DEBUG: action event started with event type:', typeof event, ' and event data:', event)
  if(!isTestMode) console.log('DEBUG: action event started with context type:', typeof context, ' and context data:', context)


  //TODO: it appears that on some runs, the context logGroupName and logStreamName is undefined
  //this needs to be investigated
  //in the meanwhile, only add these variables in the log info if they are available
  //in test mode, they will not be populated
  const logInfo = {}
  if(context.awsRequestId != null){
    logInfo['requestId'] = context.awsRequestId
  }
  if(context.logGroupName != null){
    logInfo['groupName'] = context.logGroupName
  }
  if(context.logStreamName != null){
    logInfo['streamName'] = context.logStreamName
  }
  if(context.awsRequestId != null && context.logGroupName != null && context.logStreamName != null){
    const logUrl = 'https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logEventViewer:group='
      + context.logGroupName + ';stream=' + context.logStreamName +';filter="'+ context.awsRequestId + '"'
    logInfo['url'] = encodeURI(logUrl)
  }


  //avoid exposing the action function to unnecessary environment variables
  sanctifyEnvVariables()
  

  //the event parameters sent by the engine are: 
  //--inputs: the actual input parameters to the action function
  //--actionName: the action name to be used inside the action package
  //--context: contains auth, batch mode, etc...
  if(!(event && event.actionName && event.inputs && event.context) ){
    console.log('CRITICAL ERROR: failed to find parameters actionName, inputs, and context in event object:', event)
    const actionOutputError = new ActionFunctionReturnType(
      null,
      ClayInternalStatus.ERROR_MISSING_EVENT_INPUT,
      'Internal error. Please contact Clay support.',
      null,
      null,
      logInfo
    )
    if(isTestMode){
      return actionOutputError.getSerializedObject()
    }
    else{
      return clayLambdaResponse(actionOutputError.getSerializedObject(), 
        'action event did not have action name, inputs, or context parameter', 
        false)
    }
  }

  //load the action package definition and find the desired action
  try{
    const actionName = event.actionName

    const actionPackageDefinition = requireUncached('./../src/index.js')

    let actionDefinition
    if(actionPackageDefinition && 'actionDefinitions' in actionPackageDefinition && Array.isArray(actionPackageDefinition.actionDefinitions) ){
      actionDefinition = actionPackageDefinition.actionDefinitions.find(oneActionDefinition => oneActionDefinition.name == actionName)
    }

    if(!(actionDefinition && actionDefinition.function && typeof actionDefinition.function == 'function') ){
      console.log('ERROR: unable to find action function for action name:', actionName, ' in action package')
      const actionOutputError = new ActionFunctionReturnType(
        null,
        ClayInternalStatus.ERROR_MISSING_ACTION_FUNCTION,
        'The action package does not contain an action function for action name: ' + actionName,
        null,
        null,
        logInfo
      )
      if(isTestMode){
        return actionOutputError.getSerializedObject()
      }
      else{
        return clayLambdaResponse(actionOutputError.getSerializedObject(), 
          'index.js does not contain a proper action function for action name: ' + actionName, 
          false)
      }
    }

    const actionFunction = actionDefinition.function
    const actionFunctionInputs = event.inputs
    const actionFunctionContext = {
      success: (data, textPreview, imagePreview) => {
        return {
          data, 
          status: ClayStatus.SUCCESS,
          message: null,
          textPreview,
          imagePreview
        }
      },
      fail: (message, errorType = ClayStatus.ERROR) => {
        return {
          data: null, 
          status: errorType,
          message,
          textPreview: null,
          imagePreview: null
        }
      },
      status: ClayStatus,
      log: (message) => {
        console.log('ACTION_LOG', message)
      }
    }

    //call the action function
    const actionOutput = await actionFunction(actionFunctionInputs, actionFunctionContext)
    if(!isTestMode) console.log('DEBUG: action function execution complete for action:', actionName, ' with action output:', actionOutput)

    if(ActionFunctionReturnType.isValidActionFunctionReturn(actionOutput) && actionOutput.status in ClayStatus){
      const actionOutputSuccess = new ActionFunctionReturnType(
        actionOutput.data,
        actionOutput.status,
        actionOutput.message,
        actionOutput.textPreview,
        actionOutput.imagePreview,
        logInfo
      )
      if(isTestMode){
        return actionOutputSuccess.getSerializedObject()
      }
      else{
        return clayLambdaResponse(actionOutputSuccess.getSerializedObject(), 
          'function execution finished successfully', 
          true)
      }
    }
    else{
      console.log('ERROR: invalid action function return object for action:', actionName, ', context.success or context.fail should be used')
      const actionOutputError = new ActionFunctionReturnType(
        null,
        ClayInternalStatus.ERROR_INVALID_ACTION_OUTPUT_DATA,
        'The action function did not return a valid output, context.success or context.fail should be used',
        null,
        null,
        logInfo
      )
      if(isTestMode){
        return actionOutputError.getSerializedObject()
      }
      else{
        return clayLambdaResponse(actionOutputError.getSerializedObject(), 
          'invalid action function return object', 
          false)
      }
    }
  }
  catch(err){
    console.log('ERROR: action function for action:', actionName, ' encountered an execution error:', err)
    const actionOutputError = new ActionFunctionReturnType(
      null,
      ClayInternalStatus.ERROR_ACTION_RUNTIME_ERROR,
      'The action function threw an exception: ' + JSON.stringify(err),
      null,
      null,
      logInfo
    )
    if(isTestMode){
      return actionOutputError.getSerializedObject()
    }
    else{
      return clayLambdaResponse(actionOutputError.getSerializedObject(), 
        'execution error in the action function for action name: ' + event.actionName, 
        false)
    }
  }

}

exports.handler = runLambda
