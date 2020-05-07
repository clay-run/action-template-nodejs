## Clay action package template

The goal of this action package template is to show how to create an action package and expose the full set of features available to the action creator. It also serves as a skeleton code for future action package creation.

### Action package definition and action definitions

The `src/` directory must contain an `index.js` file, which contains the action package definition. Please review the example `index.js` file in this action package to learn more about action package definitions.

The file `src/get_top_reddit_posts.js` contains an example of an action definition that implements the various features available to the action creator.
A few notes about the action definition:
- the input and output parameters can have the following types:
  - boolean
  - number
  - text
  - array
  - object
- an optional rate limit rules parameter can be included to define throttling rules if your action should not be called excessively
  - concurrency rules define the maximum number of concurrent requests
```
  e.g. any user can send up to 4 concurrent requests:

  rateLimitRules: {
    concurrency: [
      {
        bucket: ['USER'],
        limit: 4
      }
    ]
  }
```
  -  time window rules define the maximum number of requests in a particular time window
```
  e.g. any authentication key can only be used 15 times in a 60 second time window
  
  rateLimitRules: {
    timeWindow: [
      {
        bucket: ['PRIVATE_AUTH_KEY'],
        limit: 15,
        durationMs: 60000
      }
    ]
  }
```

A few notes about the action function:
- the action function should always take in 2 parameters, the action inputs and the context
- the action inputs will match the action definition's inputParameterSchema
- the context exposes various utility parameters for the action function:
  - context.log(...logs) allows the user to log messages and make them available on Clay
  - context.success({data, textPreview, imagePreview}) generates a return object indicating a success for the action function execution
  - context.fail({message, errorType = context.status.ERROR}) generates a return object indicating a failure of the action function execution
  - context.status contains additional status codes useful to better describe the error type, including:
```
ERROR_MISSING_INPUT
ERROR_INVALID_INPUT
ERROR_MISSING_OUTPUT_DATA
ERROR_INVALID_OUTPUT_DATA
ERROR_BAD_REQUEST
ERROR_TIMEOUT
ERROR_INVALID_CREDENTIALS
```

### Running your actions locally during development

In order to test your actions, you can run the following command:
`npm run action your-action-name path/to/input/file`
or
`npm run action your-action-name your-data-sample-name path/to/input/file`

- where `your-action-name` is the action name as defined in the action definition
- where `your-data-sample-name` is the key in the data sample object that you want to use as inputs
- where `path/to/input/file` is a sample input data for the action
- make sure to first install the dependencies before running the command, including the clay action client by running `npm install`

e.g. `npm run action gettopredditposts sample_data/test_get_top_reddit_posts.js`

The directory `sample_data/` contains a sample input file to illustrate its usage.
