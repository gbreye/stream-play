import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const uri = process.env.MONGODB_URI


async function connectDB() {
    try {
        await mongoose.connect(uri);
        await mongoose.connection.db.admin().command({ping:1});
        console.log('Connected to MongoDB');
    } catch(error) {
        console.log(error)
    }
};

async function disconnectDB() {
    try {
        await mongoose.disconnect();
    } catch(error) {
        console.log(error);
    }
}

export { connectDB, disconnectDB };