import dotenv from "dotenv";
dotenv.config();
import User from "../../models/User";
import { createClient } from "@supabase/supabase-js";
import jsonwebtoken from "jsonwebtoken";
import { search } from "moongose/routes";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const JWT_SECRET = process.env.JWT_SECRET;

async function saveSong(req, res) {
  return (saveSong.uploadSong(req, res), saveSong.removeSong(req, res));
}

const saveSong = {
  uploadSong: async function (req, res) {
    const file = req.file;
    const name = req.body.name;
    const token = req.cookies["token"];
    if (!token) return res.status(401).json({ mes: "not authorized" });
    if (file.mimetype !== "audio/mpeg") {
      return res.status(400).json({ mes: "bad request!" });
    }
    const fileName = name;
    const { data, error } = await supabase.storage
      .from("music")
      .upload(`public/${fileName}`, file.buffer, {
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

export default saveSong;
