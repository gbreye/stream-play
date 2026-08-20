import express from 'express';
const router = express.Router();

//imports
import auth from '../../controllers/authControllers/auth.js'

router.get('/', (req, res) => {
    res.send('entry in the auth')
});

router.post('/signup', (req, res) => {
    auth.signup(req,res);
});

router.post('/login', (req, res) => {
    auth.login(req, res);
});

export default router;