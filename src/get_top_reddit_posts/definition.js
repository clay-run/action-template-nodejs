const getTopRedditPostsActionFunction = require('./get_top_reddit_posts.js')

/*
 * This is where you define your Action.
 */
const getTopRedditPostsActionDefinition = {
  name: "gettopredditposts", // unique action name across the entire action package
  function: getTopRedditPostsActionFunction, // the action function to execute
  documentationUri: "https://github.com/clay-run/action-template-nodejs/blob/master/README.md", // optional - link to documentation
  iconUri: "https://logo.clearbit.com/reddit.com?size=80", // optional - icon to be displayed on Clay
  displayName: "Get top reddit posts", // the action name to be displayed on Clay
  description: "This action allows to get the top posts of a specific subreddit", // the action description to be displayed on Clay
  //actionGroups: ["Social Media", "Reddit"], // INTERNAL ONLY - folders that will include the public action on Clay
  //authentications: [ // optional - authentication methods that can be used by the action function
  //  {
  //    provider: "api_key",
  //  }
  //],
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
  //supportsBatching: true, // optional - if allowed, the action function will receive a flag to indicate that it is running in batch mode
  //maximumBatchSize: 100, // optional - the maximum number of input objects to be received if batch mode is enabled
  outputParameterSchema: require('./output_parameter_schema.js'),
  inputSample: { // optional - a sample input object for the action function
    subredditName: "cats",
    numberOfPosts: 10
  },
  outputSample: require('./output_sample.js'),
  //pricing: { // INTERNAL ONLY - pricing rules for the action function
  //  requiresPayment: true,
  //  chargedById: "a1b2c3d4",
  //  paymentPlan: "subscription",
  //  trialRuns: 1000,
  //  pricePerRun: 5 // integer in one hundredth of a cent
  //},
  //restrictionFlags: { // INTERNAL ONLY - restriction rules related to the action function
  //  isExportable: true //optional - prevents the action function output to be exported from Clay
  //},
  //isPublic: false, // INTERNAL ONLY - allows Clay admins to make the action function public
  //rateLimitRules: { // optional - allows rate limiting rules to be defined in order to throttle the execution of the action function
  //  concurrency: [
  //    {
  //      bucket: ['USER'],
  //      limit: 4
  //    }
  //  ]
  //}
}

module.exports = getTopRedditPostsActionDefinition
