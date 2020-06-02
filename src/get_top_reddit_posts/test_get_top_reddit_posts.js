/*
 *
 * this is a sample test file for an action
 * the object should match the action definition's inputParameterSchema
 *
 */

module.exports = {
  goodSample: {
    subredditName: "cats",
    numberOfPosts: 3
  },
  badSample: {
    wrongFieldName: "badValue",
    numberOfPosts: "wrongType"
  },
  anotherSample: {
    subredditName: "dogs"
  }
}