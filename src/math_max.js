const { ClayStatus } = require('./../clay-action-module/clay_status.js')

const mathMaxActionDefinition = {
  name: "mathmax",
  function: mathMaxFunction,
  documentationUri: "http://github.com/clay-run/actions/mythirdactionguide.md",
  displayName: "Math Maximum priv v430",
  description: "This action returns the maximum number of an array of numbers",
  actionGroups: ["Utilities", "Mathematics"],
  inputParameterSchema: [
    {
      name: "numberArray",
      type: "array",
      optional: false
    }
  ],
  outputParameterSchema: [
    {
      name: "theMax",
      type: "number",
      optional: false
    }
  ],
  inputSample: {
    numberArray: [3,7,4,24,97]
  },
  outputSample: {
    theMax: 97
  },
  isPublic: false
}

function mathMaxFunction(actionInputs, context){
  context.log('entered mathMaxFunction')
  
  let arrayOfNumbers = actionInputs.numberArray
  if(!Array.isArray(arrayOfNumbers)) {
    try{
      arrayOfNumbers = JSON.parse(arrayOfNumbers)
    }
    catch(err){

    }
  }

  if(Array.isArray(arrayOfNumbers)) {
    return context.success(
      {
        theMax: Math.max(...arrayOfNumbers)
      }, //data output field
      Math.max(...arrayOfNumbers) //preview field
      )
  }
  else{
    return context.fail(
      "the numberArray should be an array or parsable into an array, invalid input", //message field
      ClayStatus.ERROR_INVALID_INPUT, //optional detailed error type
      )
  }
}

module.exports = mathMaxActionDefinition
