/*
 *
 * This sample action package illustrates various rules and principles for action package creation
 *
 * An Action Package contains one or more Action Definitions
 *
 * 
 */

const getLastTweetsAction = require("./get_last_tweets.js")
const guidGeneratorAction = require("./guid_generator.js")
const mathMaxAction = require("./math_max.js")


const myActionPackage = {
  name: "myfirstactionpackage5", //to uniquely identify an action pacakge for future updates
  description: "contains various utility actions",
  actionDefinitions: [getLastTweetsAction, guidGeneratorAction, mathMaxAction],
}

module.exports = myActionPackage
