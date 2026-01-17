const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Schema
const ProfileSchema = new mongoose.Schema({
  name: String,
  description: String,
  photo: String,
  location: { latitude: String, longitude: String },
});

const Profile = mongoose.model("Profile", ProfileSchema);

// Routes
app.get("/api/profiles", async (req, res) => {
  const profiles = await Profile.find();
  res.json(profiles);
});

app.get("/api/profiles/:id", async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  res.json(profile);
});

app.post("/api/profiles", async (req, res) => {
  const { name, description, photo } = req.body;
  const randomLocation = {
    latitude: (Math.random() * 180 - 90).toFixed(6),
    longitude: (Math.random() * 360 - 180).toFixed(6),
  };
  const newProfile = new Profile({ name, description, photo, location: randomLocation });
  await newProfile.save();
  res.status(201).json(newProfile);
});

app.put("/api/profiles/:id", async (req, res) => {
  const { name, description, photo, location } = req.body;
  const updatedProfile = await Profile.findByIdAndUpdate(
    req.params.id,
    { name, description, photo , location },
    { new: true }
  );
  res.json(updatedProfile);
});

app.delete("/api/profiles/:id", async (req, res) => {
  await Profile.findByIdAndDelete(req.params.id);
  res.json({ message: "Profile deleted successfully" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
