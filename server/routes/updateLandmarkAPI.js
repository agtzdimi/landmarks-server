const express = require("express");
const router = express.Router();
const Parse = require("parse/node");

router.get("/landmarks", async (req, res) => {
  try {
    const Landmark = Parse.Object.extend(
      process.env.LANDMARK_CLASS_NAME || "Landmarks"
    );
    const query = new Parse.Query(Landmark);
    query.select(
      "_id",
      "title",
      "description",
      "short_info",
      "photo",
      "photo_thumb",
      "location",
      "url"
    );
    const landmarksList = await query.find();
    return res.status(200).json({ results: landmarksList });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/landmarks/:landmark", async (req, res) => {
  try {
    const editingLandmark = req.query;
    const objectId = req.params.landmark;
    const Landmark = Parse.Object.extend(
      process.env.LANDMARK_CLASS_NAME || "Landmarks"
    );
    const query = new Parse.Query(Landmark);
    const currentLandmark = await query.get(objectId);
    // Create the Number array for the location
    const location = editingLandmark.location.split(",").map(coord => {
      coord = coord.replace('"','');
      return +coord;
    })
    currentLandmark.set("title", editingLandmark.title);
    currentLandmark.set("short_info", editingLandmark.short_info);
    currentLandmark.set("description", editingLandmark.description);
    currentLandmark.set("url", editingLandmark.url);
    currentLandmark.set("location", location);
    await currentLandmark.save(null, {
      sessionToken: editingLandmark.sessionToken,
    });
    return res.status(200).json({
      status: "success",
      message: `Updated ${objectId}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
