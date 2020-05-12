const sendUserSignupSlackCard = require("./send_user_signup_slack_card_definition")

const SlackActionPackage = {
  name: "slack-action-package",
  description: "A bundle of actions for interacting with Slack",
  actionDefinitions: [sendUserSignupSlackCard],
}

module.exports = SlackActionPackage
