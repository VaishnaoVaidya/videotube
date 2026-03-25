import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const normalizeMongoUri = (uri = "") => {
    const trimmed = uri.trim();

    if (!trimmed) {
        return trimmed;
    }

    // Allow .env values copied with placeholder db names like /<vaishno>?...
    return trimmed.replace(/\/<[^>]+>(?=\?|$)/, "");
}

const connectDB = async () => {
    try {
        const mongoUri = normalizeMongoUri(process.env.MONGODB_URI);

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not set");
        }

        const connectionInstance = await mongoose.connect(mongoUri, {
            dbName: DB_NAME
        });
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED: " + error);
        process.exit(1);
    }
}

export default connectDB
