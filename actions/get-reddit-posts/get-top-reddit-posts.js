const superagent = require('superagent')

/*
 *  This code is run when your action is called and is passed all parameters and authentication keys that were defined
 *  in the action-definition. 

 * @param {object} actionInputs - This will be passed the inputs from the action-definition.
 * @param {object} context  - Clay specific helpers
 * @param {object} context.auth - Authentication information based on the authentcation method defined in the action-definition
 * @param {object} context.status = Clay specific statuses that can be passed on either Success or Failure. They impact how the result is shown in the UI. 
 * @param {function} context.log - Clay specific logs
 * @param {function} context.success|fail - return this function to end exection of the action
 * 
 * You can find more instructions in the README: https://github.com/clay-run/action-template-nodejs/blob/master/README.md.
 */

module.exoprts =  (actionInputs, context) => { 
  context.log('debug: inside getLastRedditPosts with inputs: ', actionInputs)

  let numberOfPosts = 10

  if(!actionInputs.subredditName){
    return context.fail({
      message: `invalid subredditName parameter:${oneSubredditName}`,
      errorType: context.status.INVALID_INPUT_PAREMETER
    })
  }

  try {
    const redditResponse = await superagent.get(`https://www.reddit.com/r/${oneSubredditName}/top.json?limit=${numberOfPosts}`)
    // get top 10
    return context.success({
      data: redditResponse.body.data.children.splice(0,9),
      textPreview: "# of posts found",
      imagePreview: "https://logo.clearbit.com/reddit.com?size=80"
    })
  }
  catch(e) {
    return context.fail({
      message: `Call to reddit failed with error: ${err.message}`
    })
  }
}


  