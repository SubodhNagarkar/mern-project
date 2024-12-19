import mongoose from "mongoose";

const connectDB = async () => {
    // try {
    //     await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //     });
    //     mongoose.connection.on('connected', () => {
    //         console.log("Database connected successfully");
    //     });
    // } catch (error) {
    //     console.error("Database connection error:", error);
    //     process.exit(1); // Exit the process with failure
    // }
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit on failure
    }
    }

    export default connectDB;