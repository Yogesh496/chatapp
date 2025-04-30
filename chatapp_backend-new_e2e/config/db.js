const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/db_chatapp");
        console.log("MongoDb Connected")
    }
    catch (e) {
        console.log("MongoDb not connected", e);
    }
}
module.exports = connectDB;

