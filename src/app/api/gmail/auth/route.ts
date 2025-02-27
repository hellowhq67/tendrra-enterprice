
import { NextResponse } from "next/server";

export async function GET() {
  
  const redirectUri = encodeURIComponent("http://tenddra.com/api/gmail/callback"); // Change to your domain in production
  const clientId = process.env.GMAIL_CLIENT_ID;
  const scope = "https://www.googleapis.com/auth/gmail.readonly";
  
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
