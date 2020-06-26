module.exports = [ // the action function must return an object with the following parameters
  {
    name: "arrayOfPosts",
    type: "array",
    // Schema of the object(s) found inside the array:
    schema: [
      {
        name: 'title',
        displayName: 'Title',
        type: 'text'
      },
      {
        name: 'id',
        displayName: 'Id',
        type: 'text'
      },
      {
        name: 'author',
        displayName: 'Author',
        type: 'text'
      },
      {
        name: 'numberOfComments',
        displayName: 'Number of Upvotes',
        type: 'number'
      },
      {
        name: 'numberOfComments',
        displayName: 'Number of Comments',
        type: 'number'
      },
      {
        name: 'URL',
        displayName: 'URL',
        type: 'text'
      }
    ]
  }
]
