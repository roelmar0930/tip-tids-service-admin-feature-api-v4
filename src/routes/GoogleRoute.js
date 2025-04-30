const express = require("express");
const { google } = require("googleapis");
const creds = require("../creds.json");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const TeamMember = require("../models/TeamMember");

const app = express();
const router = express.Router();
app.use(cookieParser());

const oauth2Client = new google.auth.OAuth2(
  creds.web.client_id,
  creds.web.client_secret,
  creds.web.redirect_uri
);

router.get("/auth", (req, res) => {
  const redirectUrl = req.query.redirectUrl || "/";
  const url = oauth2Client.generateAuthUrl({
    hd: "telusinternational.com",
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    state: redirectUrl, // Pass the redirect URL as state
  });
  res.send(url);
});

router.get("/redirect", async (req, res) => {
  const code = req.query;
  const redirectUrl = code.state || "/"; // Get the redirect URL from state parameter

  const authDetails = {
    code: decodeURIComponent(code.code),
    scope: decodeURIComponent(code.scope),
    authuser: code.authUser,
    hd: code.hd,
    prompt: code.prompt,
  };

  if (!code) {
    return res.status(400).json({
      error: "Invalid request",
      message: "Code query parameter is required",
      redirectUrl: "/"
    });
  }

  try {
    const { tokens } = await oauth2Client.getToken(authDetails);
    oauth2Client.setCredentials(tokens);
    const { access_token, refresh_token } = tokens;

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const { name, email } = userInfo.data;

    // Get team member info using email
    const teamMemberInfo = await TeamMember.findOne({ 
      workEmailAddress: email 
    });

    if (!teamMemberInfo) {
      return res.status(404).json({
        success: false,
        redirectUrl: "/",
        error: {
          message: "Team member not found",
          details: "No team member found with this email address"
        }
      });
    }

    // Generate JWT with user data including team member info
    const jwt_token = generateJWT({
      name,
      email,
      workdayId: teamMemberInfo.workdayId,
      role: teamMemberInfo.role
    });

    // Return all necessary data for the frontend
    res.json({
      success: true,
      data: {
        tokens: {
          access_token,
          refresh_token,
          expires_in: tokens.expiry_date,
          id_token: tokens.id_token,
          jwt_token // Include the JWT token in the response
        },
        user: { 
          googleUserInfo: userInfo.data,
          teamMemberInfo: teamMemberInfo
        },
        redirectUrl
      }
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    const errorResponse = {
      success: false,
      redirectUrl: "/",
      error: {
        message: "Authentication failed"
      }
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorResponse.error.details = error.response.data;
      res.status(error.response.status).json(errorResponse);
    } else if (error.request) {
      // The request was made but no response was received
      errorResponse.error.message = "No response from authentication server";
      errorResponse.error.details = error.request;
      res.status(500).json(errorResponse);
    } else {
      // Something happened in setting up the request that triggered an Error
      errorResponse.error.message = "Error setting up authentication request";
      errorResponse.error.details = error.message;
      res.status(500).json(errorResponse);
    }
  }
});

// Function to generate JWT from user info
function generateJWT(payload) {
  const secretKey = creds.web.client_secret || 'your_secret_key'; 
  if (!secretKey) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  const options = { expiresIn: '1h' }; // JWT expiration time
  return jwt.sign(payload, secretKey, options);
}

router.post("/getUserInfo", async (req, res) => {
  try {
    oauth2Client.setCredentials(req.body);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const response = await oauth2.userinfo.get();
    
    if (!response || !response.data) {
      return res.status(404).json({
        error: "User information not found"
      });
    }

    // Get team member info using email
    const teamMemberInfo = await TeamMember.findOne({ 
      workEmailAddress: response.data.email
    });

    if (!teamMemberInfo) {
      return res.status(404).json({
        error: "Team member not found",
        message: "No team member found with this email address"
      });
    }

    // Combine Google user info with team member info
    const combinedInfo = {
      googleUser: response.data,
      teamMember: teamMemberInfo
    };
    
    res.json(combinedInfo);
  } catch (error) {
    console.error("Error fetching user info:", error);
    if (error.response) {
      res.status(error.response.status).json({
        error: "Failed to fetch user information",
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: "Internal server error",
        details: error.message
      });
    }
  }
});

const authenticate = (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    console.log("No access token found in cookies");
    return res.status(401).send("Unauthorized: No access token provided");
  }

  req.accessToken = accessToken;
  next();
};

router.get("/auth-status", authenticate, (req, res) => {
  res.status(200).json({ authenticated: true });
});

module.exports = router;
