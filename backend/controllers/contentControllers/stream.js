import dotenv from "dotenv";
import User from "../../models/User.js";
import jsonwebtoken from "jsonwebtoken";
import Readable from 'stream';
import {createClient} from "@supabase/supabase-js";
dotenv.config();
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const JWT_SECRET = process.env.JWT_SECRET;

const stream = {
  streamSong: async function(req, res) {
    const name = req.body.name;
    const token = req.cookies["token"];
    if(!token) return res.status(401).json({mes:"not authorized"});
    if(!name) return res.status(400).json({mes:"can not find null file!"});
    const {data, error} = await supabase.storage
        .from("music")
        .createSignedUrl(`public/${name}`, 60);
    if(error) return res.status(404).json({mes:'music not found!'});
    if(!data) return res.status(404).json({mes:"music not found"});
    try {
      const webStream = await fetch(data.signedUrl);
      if(!webStream.ok) {
        return res.status(502).json({mes: "error!"})
      }
      const nodeStream = Readable.fromWeb(webStream.body);
      nodeStream.pipe(res);
      req.on("close", () => {
        if(!res.writableEnded) nodeStream.destroy();
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({mes:"internal server error"});
    }
  },
  uploadSong: async function (req, res) {
    const file = req.file;
    const name = req.body.name;
    const token = req.cookies["token"];
    if (!token) return res.status(401).json({ mes: "not authorized" });
    if (file.mimetype !== "audio/mpeg") {
      return res.status(400).json({ mes: "bad request!" });
    }
    const { data, error } = await supabase.storage
      .from("music")
      .upload(`public/${name}`, file.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.mimetype,
      });
    if (error) {
      console.log("error while uploading the music");
      return res.status(500).json({ mes: "error while uploading" });
    }
    try {
      const userVerify = jsonwebtoken.verify(token, JWT_SECRET);
      const id = userVerify.id;
      const user = await User.findById(id);
      user.playlist.push(name);
      await user.save();
      return res.status(200).json({ mes: "music added!" });
    } catch (error) {
      return res.status(500).json({ mes: "" });
    }
  },
  removeSong: async function (req, res) {
    const name = req.body.name;
    const index = req.body.index;
    const token = req.cookies["token"];
    if (!token) return res.status(401).json({ mes: "not authorized" });
    const fileName = name;

    const { data, error } = await supabase.storage
      .from("music")
      .remove([`public/${fileName}`]);
    if (error) {
      console.log("error while finding the music");
      return res.status(500).json({ mes: "error while finding" });
    }
    try {
      const userVerify = jsonwebtoken.verify(token, JWT_SECRET);
      const id = userVerify.id;
      const user = await User.findById(id);
      user.playlist.splice(index, 1);
      await user.save();
      return res.status(200).json({ mes: "removed" });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ mes: "internal server error" });
    }
  },
};



export default stream;
