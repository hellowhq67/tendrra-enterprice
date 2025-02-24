import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    agentType: {
      type: String,
      required: true,
    },
    file:{
        type: String,
        required: false,
    },
    history: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        img: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.chat || mongoose.model("chat", chatSchema);