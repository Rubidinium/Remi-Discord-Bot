import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { MONGO } = process.env,
  { connect, connection, model, Schema } = require("mongoose");

const applicationSchema = new Schema({
  _id: Schema.Types.ObjectId,
  user: Object,
  application: Object,
});

await Application.findOne({ _id: id });

const createApplication = async (id) => {
  const application = {
    _id: id,
  };
  //
  let applicationDocument = new applicationSchema(application);
  applicationDocument = await applicationDocument.save();
  return applicationDocument;
};

export default {
  Application: model("application", applicationSchema),
  createApplication,
};
