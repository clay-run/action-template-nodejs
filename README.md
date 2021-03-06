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
2. Optional, advanced features available to Actions, such as authentication, retries, and rate-limiting

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
> Input and Output are defined by you, the Action author. Input uses the `inputParameterSchema` property in in the Action definition to declare the shape and type of data accepted by the Action.

Open `definition.js` and find:
1. `inputSample`
2. `inputParameterSchema`

The `inputSample` is an optional helper that's used to suggest sample data to the user of the Action.

The `inputParameterSchema` defines the type of data that your Action can accept. The Clay UI will enforce these types when users choose your action, so choose them carefully.

*Both input and output* parameter schemas use the same syntax and support the following types:
  - boolean
  - number
  - text
  - select
  - array
  - object

Input and output parameter schemas are declared as an array of objects. Each object declares the `name` (variable name), `displayName` (nicely formatted name for the UI), and `type` (data type, like 'text') of each parameter.

For example, an action that takes an `email` parameter as input would declare an input parameter schema as follows:

```js
// start of definition.js...
  inputParameterSchema: [
    {
      name: 'email',
      displayName: 'Email',
      type: 'text'
    }
  ]
// ... rest of definition.js
```

> If the email were *output* rather than input, this schema would look exactly the same -- except it would be referenced on the `outputParameterSchema` property in `definition.js`.

In general, input (and output) parameter schemas follow a common format:

```js
{
  name: 'variableNameGoesHere',
  displayName: 'A Nicely Formatted Name for the UI Goes here',
  type: 'data-type-goes-here' // data type goes here
}
```

#### Nested Parameter Schemas

Input and output schemas can be of any length and can contain nested data types like `array`s and `object`s.

Here's an example of nested data that could be the input or output of an action.

```js
{
  id: 12345,
  name: {
    fullName: 'Joe Smith',
    givenName: 'Joe',
    familyName: 'Smith'
  }
}
```

The matching parameter schema for this data would look like this:

```js
inputParameterSchema: [
  {
    name: 'id',
    displayName: 'Id',
    type: 'text'
  },
  {
    name: 'name',
    displayName: 'Name',
    type: 'object',
    //      ^^^ This indicates that we will declare a nested schema using the `schema` key below.
    schema: [
      // This schema refers to the objects nested inside `name`
      {
        name: 'fullName',
        displayName: 'Full Name',
        type: 'text'
      },
      {
        name: 'givenName',
        displayName: 'Given Name',
        type: 'text'
      },
      {
        name: 'familyName',
        displayName: 'Family Name',
        type: 'text'
      }
    ]
  }
]
```

You can declare an array in a parameter schema as well.

```js
// Sample input/output data: an ARRAY of OBJECTS.
{
  arrayOfArticles: [
    {
      title: 'The 10 Greatest Dogs of All Time',
      author: 'Rover Wagsworth',
      numberOfComments: 25,
      URL: 'https://reddit.com/10-greatest-dogs'
    },
    {
      title: 'Questioning The Human Love of Dogs',
      author: 'Meowster McLitterbox',
      URL: 'https://reddit.com/questioning-humans-dogs'
    }
  ]
}

// Matching input/output parameter schema ... as defined in definition.js file

inputParameterSchema: [
  {
    name: "arrayOfArticles",
    type: "array",
    // Schema of the object(s) found inside the array:
    schema: [
      {
        name: 'title',
        displayName: 'Title',
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
        name: 'URL',
        displayName: 'URL',
        type: 'text'
      }
    ]
  }
]
```

Select options allow you to create a dropdown menu of options for the user to pick from, and passing a value that you define. Here's a simple example example:

```js
inputParameterSchema: [
  {
    name: "mediaType",
    displayName: "Media Type",
    type: "select",
    options: [ 		// These options are an array, with a value and a display name. The value gets passed to the action, accessible via actionInputs.mySelectType.
      {
         value: "book",
	 displayName: "Book"
      },
      {
      	value: "tv",
	displayName: "Television"
      },
      {
      	value: "movie",
	displayName: "Movie"
      },
      {
        value: "mp3",
	displayName: "Audio"
      }
    ]
  }
]
```

You can also generate the options to pick from dynamically. This requires that you declare it as a dynamic option, and provide an `optionsFunction`. Here's an example!

```js
inputParameterSchema: {
  {
    name: "randomNums",
    displayName: "",
    type: "select",
    dynamicOptions: true, 	// Required to use dynamic selects
    optionsFunction: async function(optionInputs, optionContext){
    	let arrayOfValues = []	// You must return an array that takes the same form - items have both a value and a displayName. Only the value will be passed.
	for(int i = 1, i <= 3, i++){
	  var randomNum = Math.floor(Math.random() * 100)
	  arrayOfValues.push({
	    value: randomNum,
	    displayName: 'Random Number ' + i
	  })
	}
	return arrayOfValues; // People can pick between "Random Number 1, Random Number 2, Random Number 3", each with an associated value assigned with a random number beteen 0-99, not visible to the user.
    }
  }
}
```

Input Fields can also be generated dynamically using the `dynamicFields` type.

```js
inputParameterSchema: [
  {
    name: "myDynamicFieldsType",
    type: "dynamicFields",
    optional: false,
    dynamicFieldsFunction: async function(optionInputs, optionContext) {
      let ret = [];
      const columnsNames = optionInputs.columns.split(",").map(column => column.trim());
      columnsNames.forEach(column => {
        ret.push({
          name: column,
          type: "text",
          optional: false,
          description: "The corresponding mapping for column " + column,
        })
      })
      return ret;
    }
  }
]
```

### Step 4: Write Your Action
The Action definition points to a function that carries out the tasks of your action.

In the example file `get_top_reddit_posts.js`, we defined an action function getTopRedditPosts.

The action function always uses two parameters: the `inputs` you defined in your Action Definition (Step 2) and `context`.

The `context` object exposes useful methods to structure your action.

- `context.log(...logs)` allows the user to log messages and make them available on Clay
- `context.success({ message, data, textPreview, imagePreview, successType: context.status.SUCCESS_TYPE })` generates a return object indicating a success for the action function

- `context.fail({ message, errorType: context.status.ERROR_TYPE, textPreview, imagePreview })` generates a return object indicating a failure of the action function

The `message` field corresponds to a detailed description provided within the `TableSideBar/StatusIndicatorCard ` component that slides out from the right hand side upon a cell preview click.

The `textPreview` field corresponds to a short text preview within a cell preview bubble.

Note:
When returning `context.success`, if no `imagePreview` is provided, there is a fallback to the action `iconUri`. If you would like to override this, set `imagePreview` to `false`.

#### Handling Return Statuses
The `context` object provides structured statuses. This ensures that the Clay UI shows a proper message for the users of your action.

> Providing structured statuses is extremely important to communicate with your Action's user. 
>
> Sending a success status allows you to suggest more information about your action return data.
> Sending an error status, can indicate to the user exactly what went wrong. 

`context.status` contains status codes for the following status types:

```
context.status.SUCCESS_NO_DATA
context.status.ERROR_MISSING_INPUT
context.status.ERROR_INVALID_INPUT
context.status.ERROR_MISSING_OUTPUT_DATA
context.status.ERROR_INVALID_OUTPUT_DATA
context.status.ERROR_BAD_REQUEST
context.status.ERROR_TIMEOUT
context.status.ERROR_INVALID_CREDENTIALS
context.status.SUCCESS
context.status.ERROR
```

#### Adding New Statuses
If you would like to add a new status please refer to the documentation in [clay-action-client](https://github.com/clay-run/clay-action-client/blob/master/README.md).

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

Run the following command to see a sample test using the boilerplate: `yarn run action gettopredditposts src/get_top_reddit_posts/test_get_top_reddit_posts.js`

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

If you want to deploy without merging, you can deploy using

```
yarn run deploy
```
You will get an error if you are not on the `master` branch or if you have uncommitted changes. 
If you wish to force the deployment, add `-- --force` to the command.

```
yarn run deploy -- --force
```

The deployment system supports major and minor versions.
By default, each new deployment increments the minor version, resulting in an automatic update for all tables using your actions.
If you do not want to benefit from this automatic update, typically because the new release is backwards incompatible,
you can specify that you want to increment the major version of the entire action package or of individual actions, by using the command:

```
yarn run deploy -- --major // increments the major version for the entire action package
yarn run deploy -- --major myfirstaction mysecondaction // increments the major version for actions named myfirstaction and mysecondaction
```

Deployment only works if you're logged into Clay from your command line. If you can't deploy, log in with:

```
yarn run login
```

If you're not ready to go live with your action, but want to test it locally or in staging, then login to either environment before deploying with the corresponding environment tag.

```
yarn run login:local
yarn run login:staging
```
```
yarn run deploy:local
yarn run deploy:staging
```

Note: the staging environment lives here: https://dev--clay-web-app.netlify.app/

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

`bucket` describes the value that will be used to track the rate limit. You can define any number of buckets for any rule.

Valid buckets are:
- USER
- GLOBAL
- PRIVATE_AUTH_KEY

USER means the rule applies to the Clay user i.e. a Clay user can only make 4 requests per minute to an API.
GLOBAL means the rule applies across the Clay platform i.e. ALL users can only make 50 requests per minute COMBINED.
PRIVATE_AUTH_KEY means the rule applies to the API key used to authenticate the action i.e. this API key can only make 10 concurrent requests across the Clay platform.

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

Changing duration for time window rules across action definition deployments may result in unexpected behavior if two versions are running at the same time.
In particular, the smallest duration may be used under certain circumstances.

### Authentication Overview

For actions requiring authentication tokens, an authentication account can be created or selected at the time of the action column creation.
In order to prompt the user for an authentication account, the action definition must contain authentication information in the action definition.
Time window rules define the maximum number of requests in a time window.
```js
  // This says: an authentication account for Slack using OAuth must be provided to the action

  authentications: [
    {
      provider: 'slack_oauth'
    }
  ],
```

Valid authentication providers are:
- provider: 'api_key' - a freeform entry that allows users to enter an API key
- provider: 'username_password' - a freeform entry that allows users to enter a username and a password
- provider: 'custom_inputs' - a freeform entry that allows any number of fields to be defined by the action definition and prompted to the user, as follows:
```js
authentications: [
  {
    provider: "custom_inputs",
    provider_inputs: {
      domain: "PostgreSQL",
      custom_inputs: [
        {
          name: "database",
          type: "text",
          displayName: "Database Name",
          description: "Name of the database",
        },
        {
          name: "table",
          type: "text",
          displayName: "Table Name",
          description: "Name of the table",
        },
      ]
    }
  }
]
```
- provider: 'twitter' - a Twitter auth account
- provider: 'github_oauth' - a Github OAuth account
- provider: 'slack_oauth' - a Slack OAuth account
- provider: 'nylas_oauth' - a Nylas OAuth account
- provider: 'hubspot_oauth' - a Hubspot OAuth account
- provider: 'shopify_oauth' - a Shopify OAuth account

Note that generic provider types such as 'api_key' support additional fields to distinguish accounts by domain. Action definitions can specify the domain:
```js
  // This says: an authentication account of type API key associated with the Clearbit domain must be provided to the action

  authentications: [
    {
      provider: 'api_key',
      provider_inputs: {
        domain: 'clearbit'
      }
    }
  ],
```

Authentication tokens are passed in on the `context.auth` object. If no authentication has taken place, the `context.auth` object does not exist. Code defensively to handle this case.

### Action Retries

If you expect that your action might hit the 30 second time limit, consider adding retry support with `context.retry`. You **must** return this in order for your action to retry- it will not do so automatically if it hits the timeout. See a full action example using this [here](https://github.com/clay-run/action-package-apis/blob/master/src/aws_textract_pdf/aws_textract_pdf.js#L71-L74).

A quick reference:
```js
  return context.retry({
    message: 'message here'
  });
```
