require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

if (!process.env.MARVEL_API_KEY) {
  console.log("MARVEL_API_KEY is not configured");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.log("MongoDB connection failed:", err.message);
  console.log("Auth and favorites routes will not work, but Marvel API routes are available.");
});

const app = express();
app.use(cors());
app.use(express.json());

const apiClient = axios.create({
  baseURL: "https://lereacteur-marvel-api.herokuapp.com",
  timeout: 10000,
});

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

const favoritesRouter = require("./routes/favorites");
app.use("/api/favorites", favoritesRouter);

app.get("/", (req, res) => {
  return res.status(200).json("Bienvenue sur le serveur Marvel 🦸🏽‍♀️🦸");
});

app.get("/characters", async (req, res) => {
  try {
    let limit = 100;
    let filters = "";
    if (req.query.name) {
      filters += `&name=${req.query.name}`;
    }
    if (req.query.page) {
      filters += `&skip=${(req.query.page - 1) * limit}`;
    }
    const response = await apiClient.get(
      `/characters?apiKey=${process.env.MARVEL_API_KEY}${filters}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.code === "ECONNABORTED" || (error.message && error.message.includes("timeout"))) {
      return res.status(504).json({ message: "Gateway timeout" });
    }
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics/:characterId", async (req, res) => {
  try {
    const response = await apiClient.get(
      `/comics/${req.params.characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.code === "ECONNABORTED" || (error.message && error.message.includes("timeout"))) {
      return res.status(504).json({ message: "Gateway timeout" });
    }
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics", async (req, res) => {
  try {
    let limit = 100;
    let filters = "";
    if (req.query.title) {
      filters += `&title=${req.query.title}`;
    }
    if (req.query.page) {
      filters += `&skip=${(req.query.page - 1) * limit}`;
    }
    const response = await apiClient.get(
      `/comics?apiKey=${process.env.MARVEL_API_KEY}${filters}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.code === "ECONNABORTED" || (error.message && error.message.includes("timeout"))) {
      return res.status(504).json({ message: "Gateway timeout" });
    }
    return res.status(500).json({ message: error.message });
  }
});

app.all(/.*/, (req, res) => {
  return res.status(404).json({ message: "Not found" });
});

app.listen(3000, () => {
  console.log("Server started");
});
