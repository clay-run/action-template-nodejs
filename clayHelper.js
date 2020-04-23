const Clay = {
  success: (data, preview) => {
    new ActionFunctionReturnType(data, ActionFunctionStatusEnum.SUCCESS, message, preview)
  },
  fail: (message) => {
    new ActionFunctionReturnType(null, ActionFunctionStatusEnum.ERROR, message)
  },
  ActionFunctionReturnType,
  ActionFunctionStatusEnum,
}

const ActionFunctionStatusEnum = {
  //EXTERNAL
  //top level SUCCESS
  SUCCESS: "SUCCESS",

  // Can detect this on the engine side just show it differently in the UI. These should be returned from the executor
  SUCCESS_NO_DATA: "SUCCESS_NO_DATA",
  //top level ERROR
  //these errors will populate an error object with an error type and error message
  ERROR: "ERROR",

  // I think these ones we can detect at the backend no need for it to be explicit by the user
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

module.exports = Clay