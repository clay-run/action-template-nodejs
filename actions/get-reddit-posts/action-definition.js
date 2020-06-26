// See README.MD for an in-depth explanation of each parameter.
module.exports = {
  name: "get-top-reddit-posts", 
  function: require('./get-top-reddit-posts.js'), 
  documentationUri: "https://github.com/clay-run/action-template-nodejs/blob/master/README.md", 
  iconUri: "https://logo.clearbit.com/reddit.com?size=80", 
  displayName: "Get Top Reddit Posts", 
  description: "This action allows to get the top posts of a sub-reddit", 
  inputParameterSchema: [ 
    {
      name: "subredditName", 
      type: "text", 
      optional: false, 
      displayName: "SubReddit Name", 
      description: "The sub-reddit name to get posts from"
    },
    {
      name: "numberOfPosts",
      type: "number",
      displayName: "# of posts",
      description: "The number of posts to fetch"
    }
  ],
  outputParameterSchema: require('./output_parameter_schema.js'),
  inputSample: require('./test-inputs').goodSample,
  outputSample: require('./output_sample.js'),  
}
