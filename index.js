/*
 *
 * This sample action package illustrates various rules and principles for action package creation
 *
 * An Action Package contains one or more Action Definitions
 *
 * 
 */

const getTopRedditPostsActionDefinition = require("./get_top_reddit_posts.js")
const mathMaxActionDefinition = require("./math_max.js")


const myActionPackage = {
  name: "myfirstactionpackage5", //to uniquely identify an action pacakge for future updates
  description: "contains various utility actions",
  actionDefinitions: [getTopRedditPostsActionDefinition, mathMaxActionDefinition],
}

module.exports = myActionPackage
