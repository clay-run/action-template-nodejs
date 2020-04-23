const ActionFunctionStatusEnum = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",

  //The action creator may choose to be more explicit in the error code
  ERROR_MISSING_INPUT: "ERROR_MISSING_INPUT",
  ERROR_INVALID_INPUT: "ERROR_INVALID_INPUT",
  ERROR_MISSING_OUTPUT_DATA: "ERROR_MISSING_OUTPUT_DATA",
  ERROR_INVALID_OUTPUT_DATA: "ERROR_INVALID_OUTPUT_DATA",
  ERROR_BAD_REQUEST: "ERROR_BAD_REQUEST",
  ERROR_TIMEOUT: "ERROR_TIMEOUT",
  ERROR_INVALID_CREDENTIALS: "ERROR_INVALID_CREDENTIALS"
}


class ActionFunctionReturnType {
  constructor(outputData, status, message, preview){
    this.outputData = outputData
    this.status = status
    this.message = message
    this.preview = preview
  }

  isActionFunctionReturnType(){
    return true
  }

  getSerializedObject(){
    return {
      outputData: this.outputData,
      status: this.status,
      message: this.message, 
      preview: this.preview 
    }
  }
}

const Clay = {
  success: (data, preview) => {
    return new ActionFunctionReturnType(data, ActionFunctionStatusEnum.SUCCESS, null, preview)
  },
  fail: (message, errorType = ActionFunctionStatusEnum.ERROR) => {
    return new ActionFunctionReturnType(null, errorType, message)
  },
  ActionFunctionReturnType,
  ActionFunctionStatusEnum,
}

module.exports = Clay