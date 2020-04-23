const Clay = require('./clayHelper.js')

const mathMaxActionDefinition = {
  name: "mathmax",
  function: math_max_function,
  documentationUri: "http://github.com/clay-run/actions/mythirdactionguide.md",
  displayName: "Math Maximum1",
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

function math_max_function(actionInputs, context){
  console.log('debug: inside math_max_function with inputs: ', actionInputs)
  const arrayOfNumbers = JSON.parse(actionInputs.numberArray)
  if(Array.isArray(arrayOfNumbers) ){
    return new Clay.ActionFunctionReturnType(
      { theMax: Math.max(...arrayOfNumbers) }, //data output field
      Clay.ActionFunctionStatusEnum.SUCCESS, //status field
      "found the max properly", //message field
      Math.max(...arrayOfNumbers) //preview field
      )
  }
  else{
    return new Clay.ActionFunctionReturnType(
      null, //data output field
      Clay.ActionFunctionStatusEnum.ERROR_INVALID_INPUT, //status field
      "the numberArray should be an array or parsable into an array, invalid input" //message field
      ) // preview field omitted
  }
}

module.exports = mathMaxActionDefinition