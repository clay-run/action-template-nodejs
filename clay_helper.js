const status = {
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

const Clay = {
  success: (data, preview) => {
    return {
      data, 
      status: status.SUCCESS,
      message: null,
      preview
    }
  },
  fail: (message, errorType = status.ERROR) => {
    return {
      data: null, 
      status: errorType,
      message,
      preview: null
    }
  },
  status
}

module.exports = Clay