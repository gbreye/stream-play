import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY
const SUPABASE_URL = process.env.SUPABASE_URL
/* db */
import { connectDB, disconnectDB } from './config/database.js';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const authRouter = await import('./routes/auth/auth.js');
const app = express();
const PORT = 3000

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('welcome to the system: ');
});

app.use('/auth', authRouter.default);

connectDB();

app.listen(PORT, () => {
    console.log(`app running on: ${PORT}`);
});

