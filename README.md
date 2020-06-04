# Clay Action Package Template 

This README describes:
1. How to create an action package
2. The features available to the action package author
3. Some boilerplate and best practices for the action package author

## Project Structure

```
package.json
src
  - index.js
  - get_top_reddit_posts.js
sample_data
  - test_get_top_reddit_posts.js
```

## Step 1: Define Your Action Package

> An "Action Package" is a bundle of related Actions.

To define an action package, you must include an `index.js` file in the `src/` directory.

Please review the example `index.js` file to see the available options.

## Step 2: Define Your Action(s)

> An "Action" is a function that runs on the Clay platform.

As the action author, you define the inputs that the Action accepts, the transformations that the Action does on the inputs, and how the output is shown to the Action's user.

Please see the example Action in `src/get_top_reddit_posts.js` to see the structure of an action.

### Input and Output
Actions have input and output defined by the author.

Input and output parameters can have the following types:
  - boolean
  - number
  - text
  - array
  - object


### Rate Limits Overview

Actions also accept a *rate limit rule*. The rate limit rule is an object that specifies:
1. optional `time window rules` parameter to define the maximum number of requests in a particular time window
2. optional `concurrency rules` define the maximum number of concurrent requests


### Rate Limits: Concurrency
Concurrency rules define the maximum number of concurrent (parallel) requests.

```
  e.g. Any user can send up to 4 concurrent requests:

  rateLimitRules: {
    concurrency: [
      {
        bucket: ['USER'],
        limit: 4
      }
    ]
  }
```

### Rate Limits: Time Window Rules
Time window rules define define the maximum number of requests in a time window.
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

### Step 3: Write the Action

The Action definition points to a function that carries out the tasks of your action.

In the sample file `get_top_reddit_posts.js`, the function is called `getTopRedditPosts`.

The action function **always uses two parameters**: the `inputs` you defined in your Action Definition (Step 2) and `context`.

The `context` exposes useful methods to structure your action.

1. `context.log(...logs)` allows the user to log messages and make them available on Clay
2. `context.success({ data, textPreview, imagePreview })` generates a return object indicating a success for the action function
3. `context.fail({ message, errorType: context.status.ERROR })` generates a return object indicating a failure of the action function

### Handling Errors

The `context` object provides structured errors that you can use. This ensures that the Clay UI shows a proper error message for the users of your action.

`context.status` contains status codes for most error types:
```
context.status.ERROR_MISSING_INPUT
context.status.ERROR_INVALID_INPUT
context.status.ERROR_MISSING_OUTPUT_DATA
context.status.ERROR_INVALID_OUTPUT_DATA
context.status.ERROR_BAD_REQUEST
context.status.ERROR_TIMEOUT
context.status.ERROR_INVALID_CREDENTIALS
```


### Running your actions locally during development

In order to test your actions, you can run the following command:
`yarn run action your-action-name path/to/input/file`
or
`yarn run action your-action-name your-data-sample-name path/to/input/file`

- where `your-action-name` is the action name as defined in the action definition
- where `your-data-sample-name` is the key in the data sample object that you want to use as inputs
- where `path/to/input/file` is a sample input data for the action
- make sure to first install the dependencies before running the command, including the clay action client by running `npm install`

e.g. `yarn run action gettopredditposts sample_data/test_get_top_reddit_posts.js`

The directory `sample_data/` contains a sample input file to illustrate its usage.
