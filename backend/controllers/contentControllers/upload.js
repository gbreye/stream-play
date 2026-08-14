import dotenv from 'dotenv';
import User from '../../models/User';


async function saveSong(req,res) {
    const file = req.file;
    const name = req.body.name;

    if(file.type !== 'mp3' && file.type !== 'ogg') {
        return res.status(400).json({mes:'bad request!'});
    };

    const fileName = name;
    //const {data, error} provavelmente eu vou usar o supabaseStorage

}