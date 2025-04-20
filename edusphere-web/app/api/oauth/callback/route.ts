import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "@/lib/google"; // your own helper

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state"); // <- this is your uid

  if (!code) {
    return new NextResponse("Missing authorization code", { status: 400 });
  }

  const oauth2Client = getOAuth2Client();

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Send access and refresh tokens to your own backend
    const response = await fetch("https://enabled-flowing-bedbug.ngrok-free.app/teacher/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: state, // uid comes from state param
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        scope: tokens.scope,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return new NextResponse("Backend error", { status: 500 });
    }

    // Redirect to dashboard after success
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (err) {
    console.error("OAuth callback error:", err);
    return new NextResponse("Token exchange failed", { status: 500 });
  }
}
