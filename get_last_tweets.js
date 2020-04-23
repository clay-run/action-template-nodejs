const Clay = require('./clayHelper')

const getLastTweetsActionDefinition = {
  name: "getlasttweets",
  function: get_last_tweets_function,
  documentationUri: "http://github.com/clay-run/actions/myfirstactionguide.md",
  displayName: "Get last tweets",
  description: "This action allows to get the last tweets of a particular twitter user",
  actionGroups: ["Social Media", "Twitter"],
  authentications: [
    {
      provider: "TwitterOAuth",
      scope: "read"
    }
  ],
  inputParameterSchema: [
    {
      name: "handle",
      type: "text",
      optional: false, //optional field
      displayName: "Twitter Handle", //optional field - field for the UI
      description: "The twitter handle of the account to get tweets from" //optional field - field for the UI
    },
    {
      name: "numberOfTweets",
      type: "number",
      optional: true,  //optional field
      displayName: "# of tweets", //optional field - field for the UI
      description: "The number of tweets to fetch" //optional field - field for the UI
    }
  ],
  supportsBatching: true, //the engine will pass a flag to the lambda that indicates that it is running in batch mode
  maximumBatchSize: 100,
  outputParameterSchema: [
    {
      name: "arrayOfTweets",
      type: "array"
    }
  ],
  inputSample: {
    handle: "@johndoe",
    numberOfTweets: 10
  },
  outputSample: {
    arrayOfTweets: [
      {
        tweetId: 4739103,
        tweetText: "I went to Mogador today and it was delicious",
        tweetTimestamp: "3/23/2020",
        tweetNumberOfRetweets: 5
      },
      {
        tweetId: 4739102,
        tweetText: "This is my first tweet everyone",
        tweetTimestamp: "3/22/2020",
        tweetNumberOfRetweets: 2
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

async function get_last_tweets_for_user(twitterHandle, numberOfTweets){
  let last_tweets = []

  //for now, randomly generated tweets
  for(let it=0; it<numberOfTweets; it++){
    const oneTweet = {
      tweetId: Math.floor(Math.random() * 10000), 
      tweetText: "Some random tweet message from " + twitterHandle + " with random number:" + Math.floor(Math.random() * 10), 
      tweetTimestamp: "3/23/2020", 
      tweetNumberOfRetweets: Math.floor(Math.random() * 100)
    }
    last_tweets.push(oneTweet)
  }

  return last_tweets
}

async function get_last_tweets_function(actionInputs, context){
  console.log('debug: inside get_last_tweets_function with inputs: ', actionInputs)
  let numberOfTweets = 10
  if(actionInputs.numberOfTweets){
    numberOfTweets = actionInputs.numberOfTweets
  }

  const oneTwitterHandle = actionInputs.handle
  let last_tweets = await get_last_tweets_for_user(oneTwitterHandle, numberOfTweets)
  return Clay.success(
    {arrayOfTweets: last_tweets},
    last_tweets.length + " tweets: e.g. " + last_tweets[0].tweetText // preview field
    )
}

module.exports = getLastTweetsActionDefinition