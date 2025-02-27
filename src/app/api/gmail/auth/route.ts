import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redirectUri = encodeURIComponent("http://localhost:3000/api/gmail/callback"); // Change to your domain in production
  const clientId = process.env.GMAIL_CLIENT_ID;
  const scope = "https://www.googleapis.com/auth/gmail.readonly";
  
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
