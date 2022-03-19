import { model, Schema } from "mongoose";

export const warnSchema = new Schema(
  {
    user: { type: String, required: true },
    moderator: { type: String, required: true },
    reason: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default model("warns", warnSchema);
