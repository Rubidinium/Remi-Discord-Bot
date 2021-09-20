import { createRequire } from "module";
const require = createRequire(
    import.meta.url);

const { MONGO } = process.env, { connect, connection, model, Schema, SchemaType } = require("mongoose");


const AttendanceSchma = new Schema({
    pages: Array,
    currentPage: Number,
    owner: String,
});

const createAttendance = async(id, applications) => {
    const attendance = {
        _id: id,
        applied: applications
    };

    let AttendanceDocument = new AttendanceSchma(user);
    AttendanceDocument = await AttendanceDocument.save();
    return AttendanceDocument;
}

export default {
    User: model("course", AttendanceSchma),
    createAttendance,
}