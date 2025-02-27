import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const accessToken = cookies().get("gmail_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "No Gmail access token found" }, { status: 401 });
  }

  try {
    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch emails");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
