const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const { use } = require("./GoogleV4Route");
const creds = require("../creds.json");

const oAuth2Client = new OAuth2Client(
  creds.web.client_id,
  creds.web.client_secret,
  creds.web.redirect_uri
);

router.get("/auth", (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    hd: "telusinternational.com",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
  });

  res.send(authorizeUrl);
});

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data;
}

router.get("/oauth", async function (req, res, next) {
  const code = req.query.code;

  console.log("Authorization code:", code);

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(tokens);

    console.info("Tokens acquired:", tokens);

    const user = await getUserData(tokens.access_token);
    console.info("User data: ", user);

    // Send the final response with both credentials and user details
    res.send({ credentials: tokens, user_details: user });
  } catch (err) {
    console.log("Error logging in with OAuth2 user:", err);
    res.status(500).send("Authentication failed");
  }
});

module.exports = router;
