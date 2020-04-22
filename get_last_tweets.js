const ActionFunctionReturnType = require('./clay_action_function_type.js')
const ActionFunctionStatusEnum = require('./clay_action_function_status.js')

async function get_last_tweets_for_user(twitterHandle, numberOfTweets){
  let last_tweets = []

  //for now, randomly generated tweets
  for(let it=0; it<numberOfTweets; it++){
    const oneTweet = {
      tweetId: Math.floor(Math.random() * 10000), 
      tweetText: "Some random tweet message with random number:" + Math.floor(Math.random() * 10), 
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
  return new ActionFunctionReturnType(
    {arrayOfTweets: last_tweets}, //data output field
    ActionFunctionStatusEnum.SUCCESS, //status field
    "fetched tweets properly", //message field
    last_tweets.length + " tweets: e.g. " + last_tweets[0].tweetText // preview field
    )
}

module.exports = get_last_tweets_function