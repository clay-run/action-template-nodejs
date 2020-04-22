const ActionFunctionReturnType = require('./clay_action_function_type.js')
const ActionFunctionStatusEnum = require( './clay_action_function_status.js' )

const ActionInternalStatusEnum = {
  //INTERNAL
  //top level PENDING
  HAS_NOT_RUN: "HAS_NOT_RUN",
  //top level RUNNING
  RUNNING: "RUNNING",
  LONG_RUNNING: "LONG_RUNNING",
  //top level QUEUED
  QUEUED: "QUEUED",
  //top level ERROR
  ERROR_INVALID_ACTION_OUTPUT_DATA: "ERROR_INVALID_ACTION_OUTPUT_DATA",
  ERROR_ACTION_RUNTIME_ERROR: "ERROR_ACTION_RUNTIME_ERROR",
  ERROR_MISSING_EVENT_INPUT: "ERROR_MISSING_EVENT_INPUT",
  ERROR_MISSING_ACTION_FUNCTION: "ERROR_MISSING_ACTION_FUNCTION"
}

/**
 * Removes all dangerous environment variable
 * before calling the user's function.
 */
function sanctifyEnvVariables() {
  const DANGEROUS_ENV_VARIBLES = [
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
  ];

  for(const key in process.env) {
    if(DANGEROUS_ENV_VARIBLES.includes(key)) {
      delete process.env[key]
    }
  }
}

// utils
function requireUncached(module){
  delete require.cache[require.resolve(module)]
  return require(module)
}

function getBodyFromEvent(event) {
  let body = null

  try {
    body = JSON.parse(event.body)
  }
  catch(e) {
    body = event.body
  }

  return body
}


/* 
  
utility function for the lambda return payload on success

*/

function clayLambdaResponse(actionOutput, lambdaExecutionStatusMsg, isLambdaExecutionSuccess){
  return {
    stringifiedActionOutput: JSON.stringify(actionOutput),
    lambdaExecutionStatusMsg,
    isLambdaExecutionSuccess,
  }
}


//TODO: check if async vs callback function is better
//in particular when event loop is empty, lambdas are killed
async function runLambda(event, context) {
  console.log(event, typeof event)
  // TODO: check security checks needed in lambda 
  //remove scary env variables
  sanctifyEnvVariables();
  

  //the event parameters sent by the engine are: 
  //--inputs: the actual input parameters to the action function
  //--actionName: the action name to be used inside the action package
  //--context: contains auth, batch mode, etc..
  //double check that the engine provided them correctly
  if(!(event && event.actionName && event.inputs && event.context) ){
    console.log('CRITICAL ERROR: failed to find actionName, inputs, and context in event object:', event)
    const actionOutputError = new ActionFunctionReturnType(
      null,
      ActionInternalStatusEnum.ERROR_MISSING_EVENT_INPUT,
      'Internal error. Please contact Clay support.'
    )
    return clayLambdaResponse(actionOutputError.getSerializedObject(), 
      'lambda event did not have action name, inputs, or context parameter', 
      false)
  }

  // get the right function
  try{
    const actionPackageDefinition = requireUncached('./index.js')

    let actionFunction
    if("actionDefinitions" in actionPackageDefinition){
      for(const oneActionDefinition of actionPackageDefinition.actionDefinitions){
        if(oneActionDefinition.name === event.actionName){
          actionFunction = oneActionDefinition.function
          break
        }
      }
    }

    if(actionFunction == null || typeof actionFunction != 'function') {
      console.log('ERROR: unable to find action function for action name:', event.actionName)
      const actionOutputError = new ActionFunctionReturnType(
        null,
        ActionInternalStatusEnum.ERROR_MISSING_ACTION_FUNCTION,
        'The action package does not contain an action function for action name: ' + event.actionName
      )
      return clayLambdaResponse(actionOutputError.getSerializedObject(), 
        'index.js does not contain a proper action function for action name: ' + event.actionName, 
        false)
    }

    // handle response
    const actionOutput = await actionFunction(event.inputs, event.context)
    console.log('DEBUG: function execution finished successfully with actionOutput:', actionOutput)

    if(actionOutput.isActionFunctionReturnType() && actionOutput.status in ActionFunctionStatusEnum){
      return clayLambdaResponse(actionOutput.getSerializedObject(), 
          'function execution finished successfully', 
          true)
    }
    else{
      const actionOutputError = new ActionFunctionReturnType(
        null,
        ActionInternalStatusEnum.ERROR_INVALID_ACTION_OUTPUT_DATA,
        'The action function did not return an object with keys: result, status, and statusMessage.'
      )
      return clayLambdaResponse(actionOutputError.getSerializedObject(), 
        'invalid function return object', 
        false)
    }
  }
  catch(err){
    console.log('ERROR: execution error in the action function for action name:', event.actionName, err)
    const actionOutputError = new ActionFunctionReturnType(
      null,
      ActionInternalStatusEnum.ERROR_ACTION_RUNTIME_ERROR,
      'The action function threw an exception: ' + JSON.stringify(err)
    )
    return clayLambdaResponse(actionOutputError.getSerializedObject(), 
      'execution error in the action function for action name: ' + event.actionName, 
      false)
  }

}

exports.handler = runLambda;
