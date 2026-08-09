import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const authRouter = await import('./routes/auth/auth.js')

const app = express();
const PORT = 3000

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('welcome to the system: ');
});

app.use('/auth', authRouter.default);
app.listen(PORT, () => {
    console.log(`app running on: ${PORT}`);
});

