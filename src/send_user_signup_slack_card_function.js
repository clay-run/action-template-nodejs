const fetch = require('node-fetch')
const fs = require('fs')

const Card = require('./card.js')

const CLAY_TESTING_CHANNEL_LOCAL = "https://hooks.slack.com/services/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";

const CUSTOMER_TEAM_WEBHOOK_CHANNEL_STAGING =
"https://hooks.slack.com/services/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"

module.exports = async (inputs, context) => {
  try {
    let {
      eventType = "Signup",
      onlySendIfNameIncluded = false,
      slackChannelWebhookURLs = [],
      email,
      personName,
      personBio,
      personLinkedInURL,
      personLinkedInUsername,
      personProfilePicture,
      personLocation,
      personTimezone,
      companyURL,
      companyName,
      companyEmployeeCount,
      companyIndustry,
      companyLinkedInUsername,
      companyLinkedInURL,
      companyLogo,
      companyLocation,
      companyTimezone
    } = inputs

    let card;

    if (!slackChannelWebhookURLs.length) {
      return context.fail({
        message: 'You must include at least one URL in slackChannelWebhookURLs',
        errrorType: context.status.ERROR_MISSING_INPUT
      });
    }

    if (onlySendIfNameIncluded && !personName) {
      card = {
        text: eventType === "waitlist"
          ? `:spiral_note_pad: NEW WAITLIST: ${email}`
          : `:fire: NEW SIGNUP: ${email}`,
        blocks: [
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${
                eventType === "waitlist"
                  ? ":spiral_note_pad: NEW WAITLIST"
                  : ":fire: NEW SIGNUP"
                } \n <mailto:${email}|${email}>`,
            },
          },
          {
            type: "divider",
          }
        ]
      }

    } else {

      card = await Card({
        shouldShowCompany: companyName,
        eventType,
        email,
        personName,
        personBio,
        personLinkedInURL,
        personLinkedInUsername,
        personProfilePicture,
        personLocation,
        personTimezone,

        companyURL,
        companyName,
        companyEmployeeCount,
        companyIndustry,

        companyLinkedInUsername,
        companyLinkedInURL,
        companyLogo,
        companyLocation,
        companyTimezone,
      });

    }

    let sendToSlack = slackChannelWebhookURLs.map(channelURL => fetch(channelURL, {
        method: "POST",
        body: JSON.stringify(card),
      }))

    await Promise.all(sendToSlack)

    return context.success({
      data: {
        wasSent: true,
      },
      textPreview: "✔️ Sent",
    });

  } catch (e) {
    context.log(e)

    return context.fail({
      message: e.message
    })
  }
}
