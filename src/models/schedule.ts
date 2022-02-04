import { model, Schema } from "mongoose";

const scheduleSchema = new Schema({
  tutor: { type: String, required: true },
  student: { type: String, required: true },
  time: { type: Date, required: true },
  subject: { type: String },
});

export default model("Schedules", scheduleSchema);
