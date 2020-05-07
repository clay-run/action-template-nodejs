const superagent = require('superagent')

/*
 * This is where you define your Action.
 */
const getTopRedditPostsActionDefinition = {
  name: "gettopredditposts", // unique action name across the entire action package
  function: getTopRedditPosts, // the action function to execute
  documentationUri: "http://github.com/clay-run/actions/myfirstactionguide.md", // optional - link to documentation
  iconUri: "https://logo.clearbit.com/reddit.com?size=80",
  displayName: "Get top reddit posts", // the action name to be displayed on Clay
  description: "This action allows to get the top posts of a specific subreddit", // the action description to be displayed on Clay
  actionGroups: ["Social Media", "Reddit"], // INTERNAL ONLY - folders that will include the public action on Clay
  authentications: [ // optional - authentication methods that can be used by the action function
    {
      provider: "api_key",
    }
  ],
  inputParameterSchema: [ // the action function expects an object with the following parameters
    {
      name: "subredditName", // the parameter key in the object
      type: "text", // the parameter type - boolean, number, text, array, object
      optional: false, // optional - determines if the parameter is optional, defaults to false
      displayName: "SubReddit Name", // optional field - the parameter name displayed on Clay
      description: "The SubReddit name to get posts from" // optional field - the parameter description displayed on Clay
    },
    {
      name: "numberOfPosts",
      type: "number",
      optional: true,
      displayName: "# of posts",
      description: "The number of posts to fetch"
    }
  ],
  supportsBatching: true, // optional - if allowed, the action function will receive a flag to indicate that it is running in batch mode
  maximumBatchSize: 100, // optional - the maximum number of input objects to be received if batch mode is enabled
  outputParameterSchema: [ // the action function must return an object with the following parameters
    {
      name: "arrayOfPosts",
      type: "array"
    }
  ],
  inputSample: { // optional - a sample input object for the action function
    subredditName: "cats",
    numberOfPosts: 10
  },
  outputSample: { // optional - a sample output object for the action function
    arrayOfPosts: [
      {
        title: "Luna and her babies. Babies may have been in trouble if it wasn't for some help from a user on Reddit. ❤",
        id: 'g6uq9b',
        author: 'WubbaLoveaDubDub',
        numberOfUpvotes: 17329,
        numberOfComments: 259,
        url: 'https://www.reddit.com/r/cats/comments/g6uq9b/luna_and_her_babies_babies_may_have_been_in/'
      },
      {
        title: 'This is my best friend. 4 years ago my sister in law found this poor thing in a garbage can.',
        id: 'g6klzh',
        author: 'Lobby_Swanson',
        numberOfUpvotes: 6820,
        numberOfComments: 117,
        url: 'https://www.reddit.com/r/cats/comments/g6klzh/this_is_my_best_friend_4_years_ago_my_sister_in/'
      }
    ]
  },
  pricing: { // INTERNAL ONLY - pricing rules for the action function
    requiresPayment: true,
    chargedById: "a1b2c3d4",
    paymentPlan: "subscription",
    trialRuns: 1000,
    pricePerRun: 5 // integer in one hundredth of a cent
  },
  restrictionFlags: { // INTERNAL ONLY - restriction rules related to the action function
    isExportable: true //optional - prevents the action function output to be exported from Clay
  },
  isPublic: false, // INTERNAL ONLY - allows Clay admins to make the action function public
  rateLimitRules: { // optional - allows rate limiting rules to be defined in order to throttle the execution of the action function
    concurrency: [
      {
        bucket: ['USER'],
        limit: 4
      }
    ],
    timeWindow: [
      {
        bucket: ['PRIVATE_AUTH_KEY'],
        limit: 15,
        durationMs: 60000
      }
    ]
  }
}

/*
 * This is where you write the behavior of your Action.
 *
 * `actionInputs` must match the inputs you defined in the Action definition.
 *
 * `context` provides `.log` `.fail` `.success` and `.status` to help you interact with the Clay platform.
 */
async function getTopRedditPosts(actionInputs, context) { // <--- All Actions take two parameters: `actionInputs` and `context`
  context.log('debug: inside getLastRedditPosts with inputs: ', actionInputs)
  // ^^^ the `context` object exposes a .log method to help you see logs inside Clay

  let numberOfPosts = 10
  if (actionInputs.numberOfPosts){
    numberOfPosts = actionInputs.numberOfPosts
  }

  const oneSubredditName = actionInputs.subredditName
  if (typeof oneSubredditName != 'string' || oneSubredditName.length === 0){
    return context.fail({
      message: `invalid subredditName parameter:${oneSubredditName}`
    })
  }

  const redditResponse = await superagent.get(`https://www.reddit.com/r/${oneSubredditName}/top.json?limit=${numberOfPosts}`)

  try {
    const topPosts = []
    for (const oneRedditPostData of redditResponse.body.data.children){
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

    if (topPosts.length > 0){
      textPreview = `${topPosts.length} posts found, e.g. ${topPosts[0].title}`
    }

    const imagePreview = "https://logo.clearbit.com/reddit.com?size=80"

    return context.success({
      // ^^^ `context` provides a `.success` handler structuring the response to your user
      data: {arrayOfPosts: topPosts},
      textPreview,
      imagePreview
    })
  } catch(err){
    /**
     * Errors that reach this block are not logged by default because context.fail will treat them as properly handled errors.
     *
     * If you want visibility to errors that occur here, you should use context.log below.
     */
    //  context.log(err.message)
    return context.fail({
      // ^^^ `context` provides a `.fail` handler for error handling
      message: 'Call to reddit failed with error:' + JSON.stringify(err)
    })
  }
}

module.exports = getTopRedditPostsActionDefinition
