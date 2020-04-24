const Clay = require('./clay_helper.js')
const superagent = require('superagent')

const getTopRedditPostsActionDefinition = {
  name: "gettopredditposts",
  function: getTopRedditPosts,
  documentationUri: "http://github.com/clay-run/actions/myfirstactionguide.md",
  displayName: "Get top reddit posts",
  description: "This action allows to get the top posts of a specific subreddit",
  actionGroups: ["Social Media", "Reddit"],
  authentications: [
    {
      provider: "RedditOAuth",
      scope: "read"
    }
  ],
  inputParameterSchema: [
    {
      name: "subredditName",
      type: "text",
      optional: false, //optional field
      displayName: "SubReddit Name", //optional field - field for the UI
      description: "The SubReddit name to get posts from" //optional field - field for the UI
    },
    {
      name: "numberOfPosts",
      type: "number",
      optional: true,  //optional field
      displayName: "# of posts", //optional field - field for the UI
      description: "The number of posts to fetch" //optional field - field for the UI
    }
  ],
  supportsBatching: true, //the engine will pass a flag to the lambda that indicates that it is running in batch mode
  maximumBatchSize: 100,
  outputParameterSchema: [
    {
      name: "arrayOfPosts",
      type: "array"
    }
  ],
  inputSample: {
    subredditName: "cats",
    numberOfPosts: 10
  },
  outputSample: {
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
  pricing: {
    requiresPayment: true,
    chargedById: "a1b2c3d4",
    paymentPlan: "subscription",
    trialRuns: 1000,
    pricePerRun: 5 //integer? in cents?
  },
  restrictionFlags: {
    isExportable: true
  },
  isPublic: false,
  rateLimitRules: {
    concurrency: [
      {
        bucket: ['USER'],
        limit: 4
      },
      {
        bucket: ['USER', 'PUBLIC_AUTH_KEY'],
        limit: 2
      },
    ],
    timeWindow: [
      {
        bucket: ['PUBLIC_AUTH_KEY'],
        limit: 15,
        durationMs: 60000000
      },
      {
        bucket: ['PRIVATE_AUTH_KEY'],
        limit: 15,
        durationMs: 60000000
      }
    ]
  }
}


async function getTopRedditPosts(actionInputs, context){
  console.log('debug: inside getLastRedditPosts with inputs: ', actionInputs)

  
  let numberOfPosts = 10
  if(actionInputs.numberOfPosts){
    numberOfPosts = actionInputs.numberOfPosts
  }
  const oneSubredditName = actionInputs.subredditName

  const redditResponse = await superagent.get('https://www.reddit.com/r/' + oneSubredditName + '/top.json?limit=' + numberOfPosts)

  try{
    const topPosts = []
    for(const oneRedditPostData of redditResponse.body.data.children){
      const oneRedditPost = {
        title: oneRedditPostData.data.title,
        id: oneRedditPostData.data.id,
        author: oneRedditPostData.data.author,
        numberOfUpvotes: oneRedditPostData.data.ups,
        numberOfComments: oneRedditPostData.data.num_comments,
        url: 'https://www.reddit.com' + oneRedditPostData.data.permalink
      }
      topPosts.push(oneRedditPost)
    }
    let previewMessage = "No posts found"
    if(topPosts.length > 0){
      previewMessage = topPosts.length + " posts found, e.g. " + topPosts[0].title
    }
    return Clay.success(
      {arrayOfPosts: topPosts},
      previewMessage
      )
  }
  catch(err){
    return Clay.fail(
      'call to reddit failed with error:' + JSON.stringify(err)
      )
  }
}

module.exports = getTopRedditPostsActionDefinition