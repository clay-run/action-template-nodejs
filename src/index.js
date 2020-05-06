/*
 *
 * This sample action package illustrates various rules and principles for action package creation
 *
 * An Action Package contains one or more Action Definitions
 *
 * 
 */

const getTopRedditPostsActionDefinition = require("./get_top_reddit_posts.js")

/*
 *
 * The action definition object to be exported
 * 
 */
const myActionPackage = {
  name: "myfirstactionpackage", //a globally unique name to identify the package for future updates
  description: "contains various actions", //a description of the package's purpose or content
  actionDefinitions: [getTopRedditPostsActionDefinition], //the action definitions exposed by the action package
}

module.exports = myActionPackage
