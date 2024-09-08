const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/js", express.static("./js"));
app.use("/css", express.static("./css"));
app.use("/en", express.static("./lang/messages/en"));

// Serve the HTML file
app.get('/0/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
