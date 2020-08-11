/*
    This is an Action Package. It consists of one more Actions. 
    Add an Action by importing it's action-definition.js and adding it to the actionDefinitions array
*/

const getTopRedditPosts = require("./get-reddit-posts/action-definition.js")

module.exports =  {
  name: "Reddit-Action-Package", 
  description: "Actions to search and get posts from Reddit", 
  actionDefinitions: [getTopRedditPosts], 
}
