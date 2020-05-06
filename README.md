## Clay action package template

The goal of this action package template is to show how to create an action package and expose the full set of features available to the action creator. It also serves as a skeleton code for future action package creation.

### Action package definition and action definitions

The `src/` directory must contain an `index.js` file, which contains the action package definition. Please review the example `index.js` file in this action package to learn more about action package definitions.
The file `src/get_top_reddit_posts.js` contains an example of an action definition that implements the various features available to the action creator.

### Running your actions locally during development

In order to test your actions, you can run the following command:
`npm run action your-action-name path/to/input/file`

- where `your-action-name` is the action name as defined in the action definition
- where `path/to/input/file` is a sample input data for the action
- make sure to first install the dependencies before running the command, including the clay action client by running `npm install`

e.g. `npm run action gettopredditposts sample_data/test_get_top_reddit_posts.js`

The directory sample_data/ contains a sample input file to illustrate its usage.
