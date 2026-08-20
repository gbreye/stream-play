import express from 'express';
import multer from "multer";
const router = express.Router();

//imports
import upload from '../../controllers/contentControllers/stream.js'

router.get('/', (req, res) => {
    res.send('entry in the auth')
});

router.post('/uploadsong', upload, (req, res) => {
    upload.uploadSong(req,res);
});

router.delete('/removesong', upload, (req, res) => {
    upload.removeSong(req, res);
});

export default router;