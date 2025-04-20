// utils/googleAuth.js
import { GoogleApis,google } from 'googleapis';
import { getTeacher, updateCredentials } from '../configs/db/teacher_db.js';; // <- your DB access layer
// GoogleApis.
// google.auth.oa
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function getValidAccessToken(uid) {
  const teacher = await getTeacher(uid);
  if (!teacher) throw new Error("User not found");

  const { accessToken, refreshToken } = teacher.credentials;

  // Set existing tokens
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Try to refresh the token
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    const newAccessToken = credentials.access_token;

    // Optional: update new token in DB
    await updateCredentials(uid, newAccessToken, refreshToken, credentials.scope);

    return newAccessToken;
  } catch (err) {
    console.error("Failed to refresh token", err);
    throw new Error("Unable to refresh access token");
  }
}

export { getValidAccessToken };
