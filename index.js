/*
 *
 * this sample action package illustrates various rules and principles for action package creation
 * 
 * 1. name (action package definition): a unique name for the action package across all action packages
 *             it is a global identifier
 *             this is necessary to distinguish updates vs new action packages and allow updates from multiple users
 *             we'll start by imposing a max length of 100 with lowercase alphanumberical characters only. 
 *             This will not be strictly necessary in the future.
 * 
 * 2. name (action definition): a unique name for the action within the action package
 *             this is necessary to distinguish updates to the action vs new action in the action pacakge
 *             we'll start by imposing a max length of 100 with lowercase alphanumberical characters only 
 * 
 * 3.  the action function always expects a single object parameter for its input and an object for its output.
 *     the inputParameterSchema and outputParameterSchema represent these object input and output parameters.
 *     these schemas are defined as array of objects, with each object representing one key.
 *     the supported keys are:
 *     -name: the name of the parameter
 *     -type: the type of the parameter
 *     -optional: whether or not the parameter is optional. can be omitted. default is optional = false.
 *     -displayName: the name of the parameter displayed on the UI. can be omitted.
 *     -description: a description of the parameter displayed on the UI. can be omitted.
 * 
 * 4. inputParameterSchema on functions without arguments (e.g. GuidGenerator) are defined by
 *    -inputParameterSchema = []
 *    -omitting the inputParameterSchema
 *    -inputParameterSchema = null
 *    'undefined' will be passed to the action function
 *    TODO: we may want to standardize the way to declare no arguments for the action function
 * 
 * 5. action functions should be defined with 2 inputs arguments:
 *    -actionInputs: an object containing the parameters defined in inputParameterSchema
 *    -context: an object containing metadata about the execution of the action
 * 
 *    action functions should always return an object of the class ActionFunctionReturnType
 *    these are defined in clay_action_function_type.js
 *    ActionFunctionReturnType takes in multiple inputs, including a status defined in ActionFunctionStatusEnum
 *    these are defined in clay_action_function_status.js
 *    e.g. 
 *      return new ActionFunctionReturnType(
 *        {arrayOfTweets: last_tweets}, //data output field
 *        ActionFunctionStatusEnum.SUCCESS, //status field
 *        "fetched tweets properly", //message field
 *        last_tweets.length + " tweets: e.g. " + last_tweets[0].tweetText // preview field
 *      )
 * 
 * 

 * 
 */

const getLastTweetsFunction = require("./get_last_tweets.js")
const guidGeneratorFunction = require("./guid_generator.js")
const mathMaxFunction = require("./math_max.js")

const getLastTweetsActionDefinition = {
  name: "getlasttweets",
  function: getLastTweetsFunction,
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

const guidGeneratorActionDefinition = {
  name: "guidgenerator",
  function: guidGeneratorFunction,
  documentationUri: "http://github.com/clay-run/actions/mysecondactionguide.md",
  displayName: "GUID Generator",
  description: "This action allows the user to generate a GUID",
  actionGroups: ["Utilities"],
  inputParameterSchema: [],//we can allow empty array, null, or omitting inputParameterSchema; we'll pass 'undefined' to the action function
  outputParameterSchema:[
    {
      name: "theguid",
      type: "text"
    }
  ],
  inputSample: null,
  outputSample: {
    theguid: "b2f07c7d-29dc-4408-9012-45b8d13206e5"
  },
  isPublic: false
}

const mathMaxActionDefinition = {
  name: "mathmax",
  function: mathMaxFunction,
  documentationUri: "http://github.com/clay-run/actions/mythirdactionguide.md",
  displayName: "Math Maximum1",
  description: "This action returns the maximum number of an array of numbers",
  actionGroups: ["Utilities", "Mathematics"],
  inputParameterSchema: [
    {
      name: "numberArray",
      type: "array",
      optional: false
    }
  ],
  outputParameterSchema: [
    {
      name: "theMax",
      type: "number",
      optional: false
    }
  ],
  inputSample: {
    numberArray: [3,7,4,24,97]
  },
  outputSample: {
    theMax: 97
  },
  isPublic: false
}

const myActionPackage = {
  name: "myfirstactionpackage5", //to uniquely identify an action pacakge for future updates
  description: "contains various utility actions",
  actionDefinitions: [getLastTweetsActionDefinition, guidGeneratorActionDefinition, mathMaxActionDefinition],
}

module.exports = myActionPackage
