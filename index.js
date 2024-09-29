const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const lab0 = require("./lab0/route");
const lab3 = require("./lab3/route");

app.use("/0", lab0);
app.use("/3", lab3);

// Listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
