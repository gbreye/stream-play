import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


/* db */
import { connectDB, disconnectDB } from './config/database.js';

const authRouter = await import('./routes/auth/auth.js');
const streamRouter = await import('./routes/stream/stream.js');
const app = express();
const PORT = 3000

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('welcome to the system: ');
});

app.use('/auth', authRouter.default);
app.use('/stream', streamRouter.default);

await connectDB();

app.listen(PORT, () => {
    console.log(`app running on: ${PORT}`);
});

