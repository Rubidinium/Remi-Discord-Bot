import { createRequire } from "module";
const require = createRequire(
    import.meta.url);

const { MONGO } = process.env, { connect, connection, model, Schema, SchemaType } = require("mongoose");


const AttendanceSchma = new Schema({
    courseId: String,
    hours: Number,
    start: Date,
    end: Date
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