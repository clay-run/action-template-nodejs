/*
 *
 * This is where you define your Action Package.
 *
 * An Action Package contains one or more Action Definitions.
 *
 * Be sure to add any actions you want included in your Action Package to the `actionDefinitions` array.
 *
 */

const getTopRedditPostsActionDefinition = require("./get_top_reddit_posts/definition.js")

/*
 * The Action Package definition
 */
const RedditActionPackage = {
  name: "redditactionpackage", // a globally unique name to identify the package
  description: "Actions to help search and read posts on Reddit", // a description of the package's purpose or content
  actionDefinitions: [getTopRedditPostsActionDefinition], // the actions included in the action package
}

module.exports = RedditActionPackage
