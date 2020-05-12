const sendUserSignupSlackCard = require('./send_user_signup_slack_card_function')

/*
 * This is where you define your Action.
 */
const sendUserSignupSlackCardDefinition = {
  name: "send-user-signup-slack-card",
  function: sendUserSignupSlackCard,
  iconUri: "https://logo.clearbit.com/reddit.com?size=80",
  displayName: "Send User Signup Slack Card",
  description: "Send a Slack Card with Data about a Person and Associated Company",
  actionGroups: ["Enrichment", "Slack"],
  inputParameterSchema: [
    {
      "name": "label",
      "type": "text",
      "optional": true,
      "description": "'Signup' by default",
      "displayName": "Label",
    },
    {
      "name": "slackChannelWebhookURLs",
      "type": "array",
      "optional": false,
      "description": "Array of Slack Incoming Webhook URLs that will receive Slack Cards",
      "displayName": "Slack Channel URLs"
    },
    {
      "name": "email",
      "type": "text",
      "optional": false,
      "description": "Email of User",
      "displayName": "Email",
    },
    {
      "name": "personName",
      "type": "text",
      "optional": true,
      "description": "Name of User",
      "displayName": "Name",
    },
    {
      "name": "personBio",
      "type": "text",
      "optional": true,
      "description": "Bio of User",
      "displayName": "Bio",
    },
    {
      "name": "personLinkedInURL",
      "type": "text",
      "optional": true,
      "description": "LinkedIn URL of User",
      "displayName": "LinkedIn URL",
    },
    {
      "name": "personLinkedInUsername",
      "type": "text",
      "optional": true,
      "description": "LinkedIn Username of User",
      "displayName": "LinkedIn Username",
    },
    {
      "name": "personProfilePicture",
      "type": "text",
      "optional": true,
      "description": "URL of Profile Photo of User",
      "displayName": "Profile Picture",
    },
    {
      "name": "personLocation",
      "type": "text",
      "optional": true,
      "description": "Location of User",
      "displayName": "Location",
    },
    {
      "name": "personTimezone",
      "type": "text",
      "optional": true,
      "description": "Timezone of User",
      "displayName": "Timezone",
    },
    {
      "name": "companyURL",
      "type": "text",
      "optional": true,
      "description": "Domain of Company website",
      "displayName": "Company URL"
    },
    {
      "name": "companyName",
      "type": "text",
      "optional": true,
      "description": "Name of Company",
      "displayName": "Company Name",
    },
    {
      "name": "companyEmployeeCount",
      "type": "text",
      "description": "companyEmployeeCount",
      "optional": true,
      "description": "Number of employees at Company",
      "displayName": "Company Employee Count",
    },
    {
      "name": "companyIndustry",
      "type": "text",
      "optional": true,
      "description": "Industry of Company",
      "displayName": "Company Industry",
    },
    {
      "name": "companyLinkedInUsername",
      "type": "text",
      "optional": true,
      "description": "LinkedIn username of Company",
      "displayName": "Company LinkedIn Username",
    },
    {
      "name": "companyLinkedInURL",
      "type": "text",
      "optional": true,
      "description": "URL of Company LinkedIn",
      "displayName": "Company LinkedIn URL"
    },
    {
      "name": "companyLogo",
      "type": "text",
      "description": "companyLogo",
      "optional": true,
      "description": "URL of Logo for Company",
      "displayName": "Company Logo URL",
    },
    {
      "name": "companyLocation",
      "type": "text",
      "optional": true,
      "description": "Location of Company",
      "displayName": "Company Location",
    },
    {
      "name": "companyTimezone",
      "type": "text",
      "optional": true,
      "description": "Timezone of Company",
      "displayName": "Company Timezone",
    }
  ],
  outputParameterSchema: [
    {
      name: "wasSent",
      type: "boolean"
    }
  ],
  inputSample: {
    eventType: "signup",
    email: "mmorourke26@gmail.com",
    personName: "Matthew O'Rourke",
    personBio: "marketing director, growth and development",
    personLinkedInURL:
      "http://www.linkedin.com/in/matthew-o-rourke-ba993b20",
    // personLinkedInUsername: '',
    // personProfilePicture: '',
    personLocation: "Madison, WI, US",
    personTimezone: "America/Chicago",

    companyURL: "walgreensbootsalliance.com",
    companyName: "walgreens boots alliance",
    companyEmployeeCount: "10001+",
    companyIndustry: "pharmaceuticals",

    companyLinkedInUsername: 'walgreens-boots-alliance',
    companyLinkedInURL: "linkedin.com/company/walgreens-boots-alliance",
    // companyLogo,
    companyLocation: "deerfield, illinois, united states",
    // companyTimezone,
  },
  outputSample: {
    wasSent: true
  }
}

module.exports = sendUserSignupSlackCardDefinition
