import connectMongoDB from "@/mongodb/index";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, name, uid, subscription, profile, tokens, Agents } =
    await request.json();
  await connectMongoDB();

  // Check if the user already exists by uid or email
  let user = await User.findOne({ uid });
  if (user) {
    return NextResponse.json(
      { message: "User already exists", user },
      { status: 409 }
    );
  }

  // Create a new user
  user = await User.create({
    email,
    name,
    uid,
    subscription,
    profile,
    tokens,
    Agents,
  });

  return NextResponse.json(
    { message: "User Registered", user },
    { status: 201 }
  );
}
export async function GET(request) {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
  
    if (!email) {
      return NextResponse.json({ message: "Email parameter is required" }, { status: 400 });
    }
  
    await connectMongoDB();
  
    // Find the user by email
    const user = await User.findOne({ email });
  
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  
    return NextResponse.json({ user });
  }