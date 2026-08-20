import express from 'express';
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/cache');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

//imports
import stream from '../../controllers/contentControllers/stream.js'

router.get('/', (req, res) => {
    res.send('entry in the auth')
});

router.post('/uploadsong', upload.single('song'), (req, res) => {
    stream.uploadSong(req,res);
});

router.delete('/removesong', upload.single('song'), (req, res) => {
   stream.removeSong(req, res);
});

router.get('/stream', upload.single('song'), (req, res) => {
    stream.streamSong(req, res);
});

export default router;