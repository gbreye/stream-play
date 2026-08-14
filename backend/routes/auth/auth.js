import express from 'express';
const router = express.Router();

//imports
import loginController from '../../controllers/authControllers/login.js'
import signupController from '../../controllers/authControllers/signup.js';

router.get('/', (req, res) => {
    res.send('entry in the auth')
});

router.post('/signup', (req, res) => {
    authControllers.createUser(req,res);
});

router.post('/login', (req, res) => {
    authControllers.createUser(req, res);
});

export default router;