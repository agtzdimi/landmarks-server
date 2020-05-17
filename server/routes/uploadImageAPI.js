const express = require("express");
const router = express.Router();
const Parse = require("parse/node");
const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();

const fileTypes = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Limit to 5MB files
const uploadOptions = multer({
  storage: storage,
  limits: {
    fileSize: 5242880,
  },
  fileFilter: fileTypes,
});

router.post(
  "/landmarks/:landmarkID/uploadImage",
  uploadOptions.single("image"),
  async (req, res) => {
    try {
      const objectId = req.params.landmarkID;
      const encodedFile = req.file.buffer.toString("base64");
      const parseImage = new Parse.File(req.file.originalname, {
        base64: encodedFile,
      });
      await parseImage.save();
      const resizedImage = await sharp(req.file.buffer)
        .rotate()
        .resize(250, 250)
        .toBuffer();
      const encodedThumb = resizedImage.toString("base64");
      const parseImageThumb = new Parse.File("thumb" + req.file.originalname, {
        base64: encodedThumb,
      });
      await parseImageThumb.save();
      const Landmark = Parse.Object.extend("Landmarks");
      const query = new Parse.Query(Landmark);
      const landmark = await query.get(objectId);
      landmark.set("photo", parseImage);
      landmark.set("photo_thumb", parseImageThumb);
      landmark.save(null, { sessionToken: req.headers.sessiontoken });
      return res.status(200).json({
        ok: true,
        message: `Uploaded image for ${objectId}`,
      });
    } catch (error) {
      return res.status(500).json({ ok: false, message: error.message });
    }
  }
);

// Handle file max size error (multer)
router.use(function(err, req, res, next) {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(500)
      .send({ ok: "false", message: "File is too big (up to 5mb allowed)" });
  }
});

module.exports = router;