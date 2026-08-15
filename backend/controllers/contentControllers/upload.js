import dotenv from 'dotenv';
import User from '../../models/User';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

async function saveSong(req,res) {
    const file = req.file;
    const name = req.body.name;

    if(file.type !== 'mp3') {
        return res.status(400).json({mes:'bad request!'});
    };
    const fileName = name;
    const { data, error } = await supabase.storage.createBucket('music', {
        public: false,
        allowedMimeTypes: ['music/mp3'],
    });
    const { data, error } = await supabase.storage
        .from('music')
        .upload(`public/${fileName}`, file.buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.mimetype,
        });
    if (error) {
        console.log('error while uploading the music');
        return res.status(500).json({mes: 'error while uploading'});
    };
    try {

    } catch(error) {
        return res.status(500).json({mes:''})
    }  
};