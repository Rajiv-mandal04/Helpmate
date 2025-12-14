
//  HELPMATE BACKEND SERVER

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OpenAI from "openai";

// MODELS

import Recording from "./models/Recording.js";
import User from "./models/User.js";

// ENV + BASIC SETUP

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ----------------- Fix for __dirname in ES modules -----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DATABASE CONNECTION

const mongoURI = "mongodb://127.0.0.1:27017/helpmate";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// MULTER (AUDIO UPLOAD SETUP)

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create 'recordings' folder if not exists
const recordingsDir = path.join(__dirname, "helpmate", "recordings");
if (!fs.existsSync(recordingsDir)) fs.mkdirSync(recordingsDir, { recursive: true });

// ROOT ROUTE

app.get("/", (req, res) => {
  res.send("✅ Helpmate Server is running successfully!");
});

// AUTHENTICATION ROUTES (Signup + Login)


// SIGNUP (Create new user)
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Signup successful", user: { name, email } });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Error during signup" });
  }
});

// LOGIN (Authenticate user)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check user existence
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Validate password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Error during login" });
  }
});

// AUDIO UPLOAD + RETRIEVAL ROUTES (Fixed Version)


// Upload Audio
app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });

    const fileName = `recording_${Date.now()}.webm`;
    const filePath = path.join(recordingsDir, fileName);

    // Save file locally
    fs.writeFileSync(filePath, req.file.buffer);

    // Save file info in MongoDB
    const recording = new Recording({
      filename: fileName,
      filePath: filePath,
      contentType: req.file.mimetype,
    });

    await recording.save();

    res.json({ message: "✅ Recording uploaded successfully!", fileName });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Error uploading audio" });
  }
});

// Get All Recordings
app.get("/recordings", async (req, res) => {
  try {
    const recordings = await Recording.find().select("filename filePath createdAt");
    res.json(recordings);
  } catch (err) {
    console.error("Fetch Recordings Error:", err);
    res.status(500).send("Error fetching recordings");
  }
});

// Stream a Recording by ID
app.get("/recordings/:id", async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);
    if (!recording) return res.status(404).send("Recording not found");

    const audioPath = recording.filePath;
    if (!fs.existsSync(audioPath)) return res.status(404).send("File missing from server");

    res.set("Content-Type", recording.contentType);
    fs.createReadStream(audioPath).pipe(res);
  } catch (err) {
    console.error("Fetch Single Recording Error:", err);
    res.status(500).send("Error fetching recording");
  }
});

// GUARDIAN CHAT (OpenAI Integration)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/guardian-chat", async (req, res) => {
  const { message } = req.body;
  if (!message)
    return res.status(400).json({ error: "Message is required" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("Chat Error:", err);

    if (err.error?.code === "invalid_api_key") {
      res.status(401).json({ error: "Invalid OpenAI API key." });
    } else if (err.error?.code === "insufficient_quota") {
      res.status(403).json({ error: "Insufficient quota." });
    } else {
      res.status(500).json({ error: "Error communicating with OpenAI" });
    }
  }
});

// PROFILE ROUTE

app.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verify token
    const decoded = jwt.verify(token, "secret123");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// START SERVER

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
