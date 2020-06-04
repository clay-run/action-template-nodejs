# Clay Action Package Template

### TL/DR
- Use this template to create an Action Package on Clay.
- An Action Packages contain Actions.
- Group Actions that relate conceptually and that share code.
- Mirror this repo's structure and files.
- Be careful: anything you push to the `master` branch will be live on Clay.
___

## Getting Started

This README describes:
1. How to write an Action Package
3. How to test an Action Package
4. How to deploy an Action Package
2. Optional, advanced features available to Actions, such as authentication and rate-limiting

## Project Structure

```
package.json
// This is an ACTION PACKAGE
src
  - index.js
  // ^^^ Expose the Actions you create

  get_top_reddit_posts
  // ^^^ This contains all the files of an ACTION

    - definition.js
    // ^^^ Define metadata for your Action

    - get_top_reddit_posts.js
    // ^^^ Write your Action's logic here

    - output_parameter_schema.js
    // ^^^ Lets people use the Clay Base UI to interact with your Action

    - output_sample.js
    // ^^^ An example of what your Action produces

    - test_get_top_reddit_posts.js
    // ^^^ Test samples for your Action
```

Before you begin, run `yarn` to install all dependencies.

## Step 1: Define Your Action Package

> An "Action Package" is a bundle of related Actions.

To define an Action Package, you must include an `index.js` file in the `src/` directory.

Please review the example `index.js` file to see the available options.

We recommend setting the `name` field to a description that ends with `action_package` in snake_case. For example: `reddit_action_package`.

Always include a description, so people understand what Actions to expect inside the package.

> Action Packages can contain any number of Actions. But you should try to group actions that are conceptually similar and that share code.
>
> For example, Actions that all use different parts of the Twitter API could form a good `twitter_action_package`. Or Actions that all send data to various email platforms could be grouped through an `email_action_package`.

## Step 2: Define Your Action(s)

> An "Action" is a function that runs on the Clay platform.

As the action author, you define the inputs that the Action accepts, what the Action does with the inputs, and how the output is shown to the Action's user.

Open up `src/definition.js` to start defining your action.

Please see the example Action in `src/get_top_reddit_posts.js` for the structure of an action.

### Step 3: Define Your Input
Actions have input and output defined by the author.

Input and output parameters can have the following types:
  - boolean
  - number
  - text
  - array
  - object

Open `definition.js` and define:
1. `inputParameterSchema`
2. `inputSample`

The `inputParameterSchema` defines the type of data that your Action can accept. The Clay UI will enforce these types when users choose your action, so choose them carefully.

The `inputSample` is an optional helper that's used to suggest sample data to the user of the Action.

### Step 4: Write Your Action
The Action definition points to a function that carries out the tasks of your action.

In the example file `get_top_reddit_posts.js`, we defined an action function getTopRedditPosts.

The action function always uses two parameters: the `inputs` you defined in your Action Definition (Step 2) and `context`.

The `context` object exposes useful methods to structure your action.

- `context.log(...logs)` allows the user to log messages and make them available on Clay
- `context.success({ data, textPreview, imagePreview })` generates a return object indicating a success for the action function
- `context.fail({ message, errorType: context.status.ERROR_TYPE })` generates a return object indicating a failure of the action function

#### Handling Errors
The `context` object provides structured errors. This ensures that the Clay UI shows a proper error message for the users of your action.

> Providing structured errors is extremely important to communicate with your Action's user. Without structured errors, the user won't know what went wrong.

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

### Step 5: Test your Action
Testing is critical to your Action. Untested Actions are likely to fail. Always test your Action.

You can test your action using a file similar to `test_get_top_reddit_posts.js`.

Each key in the test file represents one sample input for your Action.

Here's an example of three samples for testing our `getTopRedditPosts` Action:

```js
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
```

Run the following command to test your Action:
`yarn run action your_action_name path/to/test/file`
or
`yarn run action your_action_name path/to/test/file your_data_sample_name`

- where `your_action_name` is the action name as defined in the Action definition (Step 2)
- where `your_data_sample_name` is the key in the data sample that you want to use as an input. For example, we could specify `goodSample` from the file above
- where `path/to/test/file` is the path to the test file itself

Run the following command to see a sample test using the boilerplate: `yarn run action gettopredditposts ./test_get_top_reddit_posts.js`

> A good test file should cover common error states, like invalid input, bad credentials, or a failed HTTP request.

### Step 6: Generate an Output Sample and Schema

To complete your Action, you need to create an output sample and output parameter schema file.

These are similar to the input sample and input parameter schema file discussed in step 3.

`output_sample.js` helps users understand what kind of output to expect from the Action.

`output_parameter_schema.js` defines the shape and type of data returned from your Action.

> It's critical to define an output_parameter_schema.js file. The mappings you provide in this file are used to link actions together in the Clay Base UI.

You can automatically generate an output sample and schema.

Run the following command for your action.
`yarn run action your_action_name path/to/test/file your_data_sample_name schema`

This is the same command as the testing command, except it includes `schema` at the end.

You'll notice that an `output_sample.js` and `output_parameter_schema.js` were generated in your Action folder.

The contents of these two files are automatically included in the `outputSample` and `outputParameterSchema` properties of `definition.js`, using Javascript's `require` syntax.

### Step 7: Deploy!

If you're ready to go live with your Action, just merge your work to the `master` branch of your GitHub repository.

If you want to deploy without merging, you can deploy to each stage using

```
yarn run deploy:local
yarn run deploy:staging
yarn run deploy // production by default
```

Deployment only works if you're logged into Clay from your command line. If you can't deploy, log in by stage with:

```
yarn run login:local
yarn run login:staging
yarn run login // production by default
```

---

## Rate Limiting, Authentication, and Other Advanced Features

> If your Action uses an API key, calls a third-party service, engages in web scraping, or causes other side effects on the internet, you should **strongly consider** rate limiting.
>
> Multiple users may run your Action at the same time. Rather than cause errors due to 3rd party APIs or excessive traffic, enforce rate limits that create a positive experience for your users.

### Rate Limits Overview

Actions can also accept a *rate limit rule*.

The rate limit rule is an object that specifies:
1. optional `time window rules` parameter to define the maximum number of requests in a particular time window
2. optional `concurrency rules` define the maximum number of concurrent requests

These rules are defined in the `definition.js` file for any Action that needs rate limiting.

### Rate Limits: Concurrency
Concurrency rules define the maximum number of concurrent (parallel) requests.

```js
  // This says: any user can send up to 4 concurrent requests.

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
Time window rules define the maximum number of requests in a time window.
```js
  // This says: any authentication key can only be used 15 times in a 60 second time window.

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

### Authentication Overview

Authentication stuff goes here TBD
