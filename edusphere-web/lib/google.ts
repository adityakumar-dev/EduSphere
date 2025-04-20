import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

// ✅ Pass redirect URI dynamically
export function getOAuth2Client() {
  return new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    "http://localhost:3001/api/oauth/callback"
  );
}

export function getDriveClient(accessToken: string, redirectUri?: string) {
  const auth = getOAuth2Client();
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth });
}
