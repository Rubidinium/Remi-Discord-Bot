import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { MONGO } = process.env,
  { connect, connection, model, Schema } = require("mongoose");

const applicationSchema = new Schema({
  _id: Schema.Types.ObjectId,
  user: Object,
  application: Object,
});

export default model("application", applicationSchema);