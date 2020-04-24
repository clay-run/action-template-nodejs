//this is a sample test file for an action
const getLastTweetsActionDefinition = require("./get_last_tweets.js")

async function action_test_wrapper(){

  try{
    const actionInputs = {
      handle: "@johndoe",
      numberOfTweets: 3
    }
    const context = {}
    console.log('Calling action function with action inputs:', actionInputs, ', and context:', context)
    const actionOutput = await getLastTweetsActionDefinition.function(actionInputs, context)
    console.log('Action function returned with actionOutput:', actionOutput)
  }
  catch(err){
    console.log('Action function call failed with exception:', err)
  }

}


action_test_wrapper()