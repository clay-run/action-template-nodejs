const superagent = require('superagent')


/*
 * This is where you write the behavior of your Action.
 *
 * `actionInputs` must match the inputs you defined in the Action definition.
 *
 * `context` provides `.log` `.fail` `.success` and `.status` to help you interact with the Clay platform.
 */
async function getTopRedditPostsActionFunction(actionInputs, context) { // <--- All Actions take two parameters: `actionInputs` and `context`
  context.log('debug: inside getLastRedditPosts with inputs: ', actionInputs)
  // ^^^ the `context` object exposes a .log method to help you see logs inside Clay

  let numberOfPosts = 10
  if(actionInputs.numberOfPosts){
    numberOfPosts = actionInputs.numberOfPosts
  }

  const oneSubredditName = actionInputs.subredditName
  if(typeof oneSubredditName != 'string' || oneSubredditName.length === 0){
    return context.fail({
      message: `invalid subredditName parameter:${oneSubredditName}`
    })
  }

  const redditResponse = await superagent.get(`https://www.reddit.com/r/${oneSubredditName}/top.json?limit=${numberOfPosts}`)

  try {
    const topPosts = []
    for(const oneRedditPostData of redditResponse.body.data.children){
      const oneRedditPost = {
        title: oneRedditPostData.data.title,
        id: oneRedditPostData.data.id,
        author: oneRedditPostData.data.author,
        numberOfUpvotes: oneRedditPostData.data.ups,
        numberOfComments: oneRedditPostData.data.num_comments,
        url: `https://www.reddit.com${oneRedditPostData.data.permalink}`
      }
      topPosts.push(oneRedditPost)
    }

    let textPreview = "No posts found"

    if(topPosts.length > 0){
      textPreview = `${topPosts.length} posts found, e.g. ${topPosts[0].title}`
    }

    const imagePreview = "https://logo.clearbit.com/reddit.com?size=80"

    context.success({
      // ^^^ `context` provides a `.success` handler structuring the response to your user
      data: {arrayOfPosts: topPosts},
      textPreview,
      imagePreview
    })
  } catch (err){
    /**
     * Errors that reach this block are not logged by default because context.fail will treat them as properly handled errors.
     *
     * If you want visibility on Clay to errors that occur here, you should use context.log below.
     */
    //  context.log(err.message)
    return context.fail({
      // ^^^ `context` provides a `.fail` handler for error handling
      message: `Call to reddit failed with error: ${err.message}`
    })
  }
}

module.exports = getTopRedditPostsActionFunction
