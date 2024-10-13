const express = require("express");
const db = require("./modules/databaseConnection"); // Import the database connection module

// Create a router instance
const router = express.Router();

// Function to create the patients table if it doesn't exist
async function createPatientsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS patients (
      patientid INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      dateOfBirth DATE
    ) ENGINE=InnoDB;
  `;

  try {
    await db.query(createTableQuery);
    console.log("Table created or already exists.");
  } catch (err) {
    console.error("Error creating table:", err.message);
  }
}

// Call the function to create the table on server start
createPatientsTable();

// POST route for INSERT queries
router.post("/api/sql", async (req, res) => {
  const { query } = req.body;

  if (query) {
    const lowerCaseQuery = query.toLowerCase();

    // Only allow INSERT queries
    if (lowerCaseQuery.startsWith("insert")) {
      try {
        const [result] = await db.query(query);
        res.status(200).json({ message: "Insert successful", result });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    } else {
      res
        .status(403)
        .json({ error: "Only INSERT queries are allowed via POST" });
    }
  } else {
    res.status(400).json({ error: "Invalid request format" });
  }
});

// GET route for SELECT queries
router.get("/api/sql/:query", async (req, res) => {
  const { query } = req.params;
  const lowerCaseQuery = decodeURIComponent(query).toLowerCase();

  // Only allow SELECT queries
  if (lowerCaseQuery.startsWith("select")) {
    try {
      const [rows] = await db.query(query);
      res.status(200).json(rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.status(403).json({ error: "Only SELECT queries are allowed via GET" });
  }
});

// Export the router to be used in the main app
module.exports = router;
