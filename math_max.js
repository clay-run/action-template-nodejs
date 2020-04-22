const ActionFunctionReturnType = require('./clay_action_function_type.js')
const ActionFunctionStatusEnum = require('./clay_action_function_status.js')

function math_max_function(actionInputs, context){
  console.log('debug: inside math_max_function with inputs: ', actionInputs)
  const arrayOfNumbers = JSON.parse(actionInputs.numberArray)
  if(Array.isArray(arrayOfNumbers) ){
    return new ActionFunctionReturnType(
      { theMax: Math.max(...arrayOfNumbers) }, //data output field
      ActionFunctionStatusEnum.SUCCESS, //status field
      "found the max properly", //message field
      Math.max(...arrayOfNumbers) //preview field
      )
  }
  else{
    return new ActionFunctionReturnType(
      null, //data output field
      ActionFunctionStatusEnum.ERROR_INVALID_INPUT, //status field
      "the numberArray should be an array or parsable into an array, invalid input" //message field
      ) // preview field omitted
  }
}

module.exports = math_max_function