//this is a sample test file for an action
const getMathMaxActionDefinition = require("./math_max.js")

async function action_test_wrapper(){

  try{
    const actionInputs = {
      numberArray: [7,3,5]
    }
    const context = {}
    console.log('Calling action function with action inputs:', actionInputs, ', and context:', context)
    const actionOutput = await getMathMaxActionDefinition.function(actionInputs, context)
    console.log('Action function returned with actionOutput:', actionOutput)
  }
  catch(err){
    console.log('Action function call failed with exception:', err)
  }

}


action_test_wrapper()