const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    } catch (error) {
      console.log("An error occurred:", error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "_" + Date.now());
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), fileController.upload);
router.get("/analyze", fileController.analyze);

module.exports = router;
