import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('entry in the auth')
});

export default router;