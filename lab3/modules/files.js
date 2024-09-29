// fileHandler.js
const fs = require("fs");
const path = require("path");

class FileHandler {
  constructor(path) {
    this.basePath = path; // Set default path
    console.log(this.basePath);
  }

  // Method to append text to a file
  appendToFile(fileName, text) {
    const filePath = path.join(this.basePath, fileName);
    return new Promise((resolve, reject) => {
      fs.appendFile(filePath, text + "\n", (err) => {
        if (err) {
          return reject("Error writing to the file");
        }
        resolve(`Appended "${text}" to ${fileName}`);
      });
    });
  }

  // Method to read content from a file
  readFile(fileName) {
    const filePath = path.join(this.basePath, fileName);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          if (err.code === "ENOENT") {
            return reject(`Error 404: File "${fileName}" not found`);
          }
          return reject("Error reading the file");
        }
        resolve(data);
      });
    });
  }

  deleteFile(fileName) {
    const filePath = path.join(this.basePath, fileName);
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            return reject(`Error 404: File "${fileName}" not found`);
          }
          return reject("Error deleting the file");
        }
        resolve(`File "${fileName}" deleted successfully`);
      });
    });
  }
}

module.exports = FileHandler;
