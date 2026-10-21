
const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;

const db = new Database(
  process.env.DB_PATH || path.join(__dirname, "enquiries.db")
);

db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());
app.use(express.static(__dirname));

const insertEnquiry = db.prepare(`
  INSERT INTO enquiries (name, email, message)
  VALUES (?, ?, ?)
`);

app.post("/api/enquiries", (req, res) => {
  const { name, email, message } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim() ||
    name.length > 100 ||
    email.length > 254 ||
    message.length > 5000
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid enquiry details."
    });
  }

  try {
    insertEnquiry.run(
      name.trim(),
      email.trim(),
      message.trim()
    );

    res.status(201).json({
      success: true,
      message: "Your enquiry has been saved successfully."
    });
  } catch (error) {
    console.error("Enquiry save failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save your enquiry. Please try again."
    });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    application: "NOIRÉ Atelier"
  });
});


app.listen(PORT, () => {
  console.log(`NOIRÉ website running at http://localhost:${PORT}`);
});
