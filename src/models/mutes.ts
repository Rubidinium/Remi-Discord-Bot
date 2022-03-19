import { model, Schema } from "mongoose";

export const muteSchema = new Schema(
  {
    user: { type: String, required: true },
    moderator: { type: String, required: true },
    duration: { type: String, required: false },
    reason: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default model("mutes", muteSchema);
