const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL); // No options needed for MongoDB Driver 4.0+
        console.log("MongoDB Atlas connected successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit process with failure
    }
};

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database.');
});

mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from the database.');
});

module.exports = connectDB;
