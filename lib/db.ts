import mongoose from "mongoose";
const uri = process.env.MONGODB_URI!;

if (!uri) {
    throw new Error("Problem with env uri")
}

const cached = global.mongoose;

if (!cached) {
    global.mongoose = { conn: null, promise: null }
}

export async function connectTodb() {
    if (cached?.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        mongoose
            .connect(uri)
            .then(() => mongoose.connection)
        console.log("Connected");
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null
        throw err;
    }

    return cached.conn;
}