const Clay = require('./clay_helper.js')

const mathMaxActionDefinition = {
  name: "mathmax",
  function: mathMaxFunction,
  documentationUri: "http://github.com/clay-run/actions/mythirdactionguide.md",
  displayName: "Math Maximum",
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
  let arrayOfNumbers = actionInputs.numberArray
  if(!Array.isArray(arrayOfNumbers)) {
    try{
      arrayOfNumbers = JSON.parse(arrayOfNumbers)
    }
    catch(err){

    }
  }

  if(Array.isArray(arrayOfNumbers)) {
    return Clay.success(
      {
        theMax: Math.max(...arrayOfNumbers)
      }, //data output field
      Math.max(...arrayOfNumbers) //preview field
      )
  }
  else{
    return Clay.fail(
      "the numberArray should be an array or parsable into an array, invalid input", //message field
      Clay.status.ERROR_INVALID_INPUT, //optional detailed error type
      )
  }
}

module.exports = mathMaxActionDefinition
