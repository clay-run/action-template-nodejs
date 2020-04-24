//this is a sample test file for an action
const getTopRedditPostsActionDefinition = require("./get_top_reddit_posts.js")

async function actionTest(){

  try{
    const actionInputs = {
      subredditName: "cats",
      numberOfPosts: 3
    }
    const context = {}
    console.log('Calling action function with action inputs:', actionInputs, ', and context:', context)
    const actionOutput = await getTopRedditPostsActionDefinition.function(actionInputs, context)
    console.log('Action function returned with actionOutput:', JSON.stringify(actionOutput) )
  }
  catch(err){
    console.log('Action function call failed with exception:', err)
  }

}


actionTest()