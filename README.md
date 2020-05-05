## Clay action package template

The goal of this action package template is to show how to create an action package and expose the full set of features available to the action creator. It also serves as a skeleton code for future action package creation.

### Action package definition and action definitions

The src/ directory must contain an index.js that contains the action definition. Please open the file to see what an action definition looks like.
The file src/get_top_reddit_posts.js contains an example of an action definition that implements the features available to the action creator.

### Running your actions locally during development

In order to test your actions, you can run the following command:
`npm run action your-action-name path-to-your-action-input-file`
- where `your-action-name` is the action name as defined in the action definition
- where `path-to-your-action-input-file` is a sample input object for the action
- make sure to install the dependencies, including the clay action client by running `npm install`

The directory sample_data/ contains two input files to illustrate this.
e.g. `npm run action gettopredditposts sample_data/test_get_top_reddit_posts.js`