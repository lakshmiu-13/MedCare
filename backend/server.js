// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// -------------------- MongoDB Connection --------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/healthcareDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------- Medicine Schema --------------------
const medicineSchema = new mongoose.Schema({
  diseaseName: String,
  symptoms: [String],
  medicines: [
    {
      name: String,
      image: String,
      shortInfo: String,
    },
  ],
  homeRemedies: [String],
  precautions: String,
  minAge: Number,
  maxAge: Number,
  gender: String, // "male" | "female" | "any"
});
const Medicine = mongoose.model("Medicine", medicineSchema);

// -------------------- Preventive Care Schema --------------------
const preventiveSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  image: String,
});
const Preventive = mongoose.model("Preventive", preventiveSchema, "preventiveTips");

// -------------------- Default Route --------------------
app.get("/", (req, res) => {
  res.send("Backend working with MongoDB!");
});

// -------------------- Medicine Routes --------------------
app.get("/medicines", async (req, res) => {
  try {
    const docs = await Medicine.find({});
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/medicines", async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.json({ message: "✅ Medicine record added", medicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Symptom Checker --------------------
app.post("/check", async (req, res) => {
  try {
    const { input, age, sex, duration } = req.body;
    if (!input || input.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a symptom or disease input." });
    }

    const searchRegex = new RegExp(input.trim(), "i");
    let record = await Medicine.findOne({ diseaseName: searchRegex });
    if (!record) record = await Medicine.findOne({ symptoms: { $in: [searchRegex] } });

    if (!record) {
      return res.status(404).json({ error: "No matching disease or symptom found." });
    }

    const userAge = age ? Number(age) : null;
    const userSex = sex ? String(sex).toLowerCase() : "any";

    const minAgeOk = !record.minAge || !userAge || userAge >= record.minAge;
    const maxAgeOk = !record.maxAge || !userAge || userAge <= record.maxAge;
    const genderOk =
      !record.gender ||
      record.gender.toLowerCase() === "any" ||
      userSex === "any" ||
      record.gender.toLowerCase() === userSex;

    const suitability = minAgeOk && maxAgeOk && genderOk;

    let extraNote = "";
    if (duration && Number(duration) > 3) {
      extraNote = "⚠️ Symptoms persisting more than 3 days. Please consult a doctor.";
    }

    return res.json({
      ...record._doc,
      extraNote,
      suitability,
      suitabilityReasons: { minAgeOk, maxAgeOk, genderOk },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Preventive Care Routes --------------------

// 1. Get all preventive tips from DB
app.get("/preventive", async (req, res) => {
  try {
    const tips = await Preventive.find({});
    res.json(tips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Search preventive tips (DB + External APIs)
app.get("/preventive/search/:query", async (req, res) => {
  const query = req.params.query;
  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

  try {
    // ---- DB results ----
    const dbResults = await Preventive.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    let externalResults = [];

    // ---- Wikipedia API ----
    try {
      const wikiRes = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      if (wikiRes.data?.extract) {
        externalResults.push({
          title: wikiRes.data.title || query,
          description: wikiRes.data.extract,
          category: "Wikipedia",
          image: wikiRes.data.thumbnail?.source || fallbackImage,
        });
      }
    } catch (e) {
      console.warn("Wikipedia API error:", e.message);
    }

    // ---- MedlinePlus API ----
    try {
      const medlineRes = await axios.get(
        `https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=${encodeURIComponent(query)}`
      );
      if (medlineRes.data) {
        externalResults.push({
          title: `Info on ${query}`,
          description: "See MedlinePlus for trusted medical guidance.",
          category: "MedlinePlus",
          image: fallbackImage,
        });
      }
    } catch (e) {
      console.warn("MedlinePlus API error:", e.message);
    }

    const results = [...dbResults, ...externalResults];
    if (results.length === 0) {
      return res.status(404).json({ error: "No tips found." });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Random tip of the day
app.get("/preventive/tip/random", async (req, res) => {
  try {
    const count = await Preventive.countDocuments();
    if (count === 0) return res.status(404).json({ error: "No preventive tips available." });
    const random = Math.floor(Math.random() * count);
    const tip = await Preventive.findOne().skip(random);
    res.json(tip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Add preventive tip
app.post("/preventive", async (req, res) => {
  try {
    const { title, category, description, image } = req.body;
    if (!title || !category || !description || !image) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const tip = new Preventive({ title, category, description, image });
    await tip.save();
    res.json({ message: "✅ Preventive tip added successfully", tip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Start Server --------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
