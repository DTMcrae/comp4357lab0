const express = require("express");
const router = express.Router();
const path = require("path");

const cors = require('cors');
router.use(cors());
router.options('*', cors());

const FileHandler = require("./modules/files");
const fileHandler = new FileHandler(__dirname + "/storage");

const utils = require("./modules/utils");
const messages = require("./lang/en/en");

router.get("/getDate", (req, res) => {
  const name = req.query.name || "Guest";
  const message = messages.getGreeting(name);
  const response = `
    <html>
        <body>
            <p style="color:blue;">${message} ${utils.getCurrentDate()}</p>
        </body>
    </html>
    `;
    res.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
  res.end(response);
});

router.get("/writeFile", async (req, res) => {
  const text = req.query.text || "Default Text";
  try {
    const result = await fileHandler.appendToFile("file.txt", text); // Use the FileHandler class to append to file
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/readFile/:filename", async (req, res) => {
  const filename = req.params.filename;
  try {
    const data = await fileHandler.readFile(filename); // Use the FileHandler class to read the file
    res.send(`<pre>${data}</pre>`);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/deleteFile/:filename", async (req, res) => {
  const filename = req.params.filename;

  try {
    const result = await fileHandler.deleteFile(filename); // Use the FileHandler class to delete the file
    res.send(result);
  } catch (error) {
    res.status(404).send(error); // Send 404 error if the file doesn't exist
  }
});

module.exports = router;