const express = require("express");
const path = require("path");
const router = express.Router();


router.use("/js", express.static(path.join(__dirname, "js")));
router.use("/css", express.static(path.join(__dirname, "css")));
router.use("/en", express.static(path.join(__dirname, "lang/messages/en")));

// Serve the HTML file
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

module.exports = router;