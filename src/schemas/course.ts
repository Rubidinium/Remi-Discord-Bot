import { createRequire } from "module";
const require = createRequire(
    import.meta.url);

const { MONGO } = process.env, { connect, connection, model, Schema, SchemaType } = require("mongoose");


const CourseSchema = new Schema({
    name: String,
    id: String,
    description: String,
    price: String,
    duration: String,
    thumbnail: String,
    completed: bool
});

const createCourse = async(id, applications) => {
    const course = {
        _id: id,
        applied: applications
    };

    let CourseDocument = new CourseSchema(user);
    CourseDocument = await CourseDocument.save();
    return CourseDocument;
}

export default {
    User: model("course", CourseSchema),
    createCourse,
}