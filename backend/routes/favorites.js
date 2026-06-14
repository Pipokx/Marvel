const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    return res.status(200).json({ favorites: req.user.favorites });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/toggle", isAuthenticated, async (req, res) => {
  try {
    const { type, id, name, thumbnail } = req.body;

    if (!type || (type !== "character" && type !== "comic") || !id) {
      return res.status(400).json({ message: "Missing or invalid parameters" });
    }

    const favoriteIndex = req.user.favorites.findIndex(
      (fav) => fav.entityId === String(id) && fav.type === type
    );

    if (favoriteIndex === -1) {
      req.user.favorites.push({ type, entityId: String(id), name, thumbnail });
    } else {
      req.user.favorites.splice(favoriteIndex, 1);
    }

    await req.user.save();

    return res.status(200).json({ favorites: req.user.favorites });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
