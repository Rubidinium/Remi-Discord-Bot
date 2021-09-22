import { createRequire } from "module";
const require = createRequire(
    import.meta.url);

const { MONGO } = process.env, { connect, connection, model, Schema } = require("mongoose");

import { Collection } from 'discord.js';

const userSchema = new Schema({
    _id: String,
    attendance: Collection
        /*
        Collection<String, {
            courseId: String,
            hours: Number,
            start: Date,
            end: Date
        }
        */
        ,
    courses: Collection
        /*
            Collection<String, {
            name: String,
            id: String,
            description: String,
            price: String,
            duration: String,
            thumbnail: String,
            completed: bool
        }
        */
        ,
    applied: Collection,
});


const createUser = async(id, applications) => {
    const user = {
        _id: id,
        applied: applications
    };

    let userDocument = new userSchema(user);
    userDocument = await userDocument.save();
    return userDocument;
}

export default {
    User: model("user", userSchema),
    createUser,
}