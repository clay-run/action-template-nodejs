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

module.exports = ActionFunctionReturnType