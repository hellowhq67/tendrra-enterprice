import mongoose, { Schema, models } from "mongoose";
import { type } from "node:os";

// Define the schema for the User model
const userSchema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    uid: { type: String, required: true, unique: true }, // Ensure UID is unique
    subscription: { type: String, default: "Free" },
    profile: { type: String, default: "user" },
    tokens: { type: Number, default: 60000 },
    Agents: { type: Number, default: 6 },
    accessToken:{type:String,default:"" },
    googelacesstoken:{type:String,default:""},
    googelrfresahtoken:{type:String,default:""},
    LinkdinToken:{type:String,default:""},
    instaToken:{type:String,default:""},

  },
  { timestamps: true }
);

// Create the User model
const User = models.User || mongoose.model("User", userSchema);
export default User;
