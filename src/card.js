const _ = require("lodash");
const fetch = require("node-fetch");

const BLANK_PROFILE_PICTURE =
  "https://clay-base-prod-static.s3.amazonaws.com/custom/person-placeholder.png";

const BLANK_COMPANY_LOGO =
  "https://clay-base-prod-static.s3.amazonaws.com/custom/company-placeholder.png";

// We can't send invalid URLs to Slack, or else the card will not be sent by their system. So we check the logo here to make sure we can send it.
async function safeImageFetch(logoUrl) {
  if (!logoUrl) return null;

  const res = await fetch(logoUrl);

  if (res.status === 200) {
    return logoUrl;
  } else {
    return null;
  }
}

function Divider() {
  return {
    type: "divider",
  };
}

function Markdown(message, accessory = {}) {
  const { image } = accessory;

  const block = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: message,
    },
  };

  if (image) {
    const { url, alt } = image;
    block.accessory = {
      type: "image",
      image_url: url,
      alt_text: alt,
    };
  }

  return block;
}

function Button(recordId) {
  return {
    type: "actions",
    block_id: "actions1",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Move to Outreach Table",
        },
        style: "primary",
        url: `https://exec.clay.run/zachc/slack-webhook-move-record?authToken=tok_4b403be76e4dfdca91b6ef70e&recordId=${recordId}`,
        action_id: "button_1",
      },
    ],
  };
}

function messageWithFallback(valToCheck, message, fallbackMessage) {
  if (!_.isNil(valToCheck)) {
    return message;
  } else if (fallbackMessage) {
    return fallbackMessage;
  } else {
    return "";
  }
}

function toGoogleQuery(str) {
  return str
    .split(" ")
    .map((str) => str.toLowerCase())
    .join("%20");
}

/**
 * Generate a Slack card...
 */
module.exports = async function Card({
  recordId,
  email,
  label, // 'waitlist' or 'signup'

  shouldShowCompany,

  personName,
  personBio,
  personLinkedInURL,
  personLinkedInUsername,
  personTwitterURL,
  personTwitterUsername,
  personTwitterFollowers,
  personTwitterFollowing,
  personProfilePicture,
  personLocation,
  personTimezone,

  companyName,
  companyURL,
  companyEmployeeCount,
  companyIndustry,
  companyLogo,
  companyTwitterURL,
  companyTwitterUsername,
  companyTwitterFollowers,
  companyTwitterFollowing,
  companyInstagramURL,
  companyInstagramUsername,
  companyInstagramFollowers,
  companyInstagramFollowing,
  companyLinkedInURL,
  companyLinkedInUsername,
  companyLocation,
  companyTimezone,
}) {
  const safeCompanyLogo = await safeImageFetch(companyLogo);
  const safePersonProfile = await safeImageFetch(personProfilePicture);

  const card = {
    text:
      label === "waitlist"
        ? `:spiral_note_pad: NEW WAITLIST: ${email}`
        : `:fire: NEW SIGNUP: ${email}`,
  };

  card.blocks = [
    Divider(),

    Markdown(
      `${
        label === "waitlist"
          ? ":spiral_note_pad: NEW WAITLIST"
          : ":fire: NEW SIGNUP"
      } \n <mailto:${email}|${email}>`
    ),

    Divider(),

    Markdown("\n>🙋‍♀️ Person"),

    Markdown(
      `*${messageWithFallback(
        personName,
        personName,
        "Prospective Customer"
      )}* \n ${messageWithFallback(personBio, personBio)}`
    ),

    Markdown(
      `${messageWithFallback(
        personLocation,
        `*Location*: ${personLocation} \n`
      )}${messageWithFallback(
        personTwitterURL,
        `*Personal Twitter Profile*: <${personTwitterURL}|${personTwitterUsername}> | _Followers_: ${personTwitterFollowers}, _Following_: ${personTwitterFollowing} \n`
      )}${messageWithFallback(
        personLinkedInURL,
        `<${personLinkedInURL} | Personal LinkedIn Profile> \n`
      )}${messageWithFallback(
        personName,
        `<https://www.google.com/search?q=${toGoogleQuery(
          personName
        )}|Prefilled Person Google Search>`
      )}`,
      {
        image: {
          url: `${safePersonProfile || BLANK_PROFILE_PICTURE}`,
          alt: messageWithFallback(
            personName,
            `profile photo of ${personName}`,
            "Profile Photo not Found"
          ),
        },
      }
    ),
  ];

  if (shouldShowCompany) {
    card.blocks = [
      ...card.blocks,
      ...[
        Markdown(
          `\n>🏢 Company \n ${messageWithFallback(
            companyName,
            `${companyName} \n`
          )}${messageWithFallback(
            companyURL,
            `*Website*: ${companyURL} \n`
          )}${messageWithFallback(
            companyLocation,
            `*Location*: ${companyLocation} \n`
          )}${messageWithFallback(
            companyEmployeeCount,
            `*Employees*: ${companyEmployeeCount} \n`
          )}${messageWithFallback(
            companyIndustry,
            `*Industry*: ${companyIndustry} \n`
          )}${messageWithFallback(
            companyTwitterURL,
            `*Company Twitter Profile*: <${companyTwitterURL}|${companyTwitterUsername}> | _Followers_: ${
              companyTwitterFollowers || "Not Available"
            }, _Following_: ${companyTwitterFollowing || "Not Available"} \n`
          )} ${messageWithFallback(
            companyInstagramURL,
            `*Company Instagram*: <${companyInstagramURL} | @${companyInstagramUsername}> | _Followers_: ${companyInstagramFollowers}, _Following_: ${companyInstagramFollowing} \n`
          )}${messageWithFallback(
            companyLinkedInURL,
            `<${companyLinkedInURL} | Company LinkedIn Profile> \n`
          )}${messageWithFallback(
            companyName || companyURL,
            `<https://www.google.com/search?q=${toGoogleQuery(
              companyName || companyURL || ""
            )}|Prefilled Company Google Search>`
          )}`,
          {
            image: {
              url: `${safeCompanyLogo || BLANK_COMPANY_LOGO}`,
              alt: messageWithFallback(
                companyURL,
                `logo of ${companyURL}`,
                "Company logo not Found"
              ),
            },
          }
        ),

        Divider(),
      ],
    ];
  }

  return card;
};
