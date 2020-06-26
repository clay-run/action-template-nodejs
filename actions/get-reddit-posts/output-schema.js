// These are used to help Clay's interface provide ways to extract data from the output of this action into the table

module.exports = [ 
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
