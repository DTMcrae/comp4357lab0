const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const cors = require('cors');
app.use(cors());
app.options('*', cors());

const lab0 = require("./lab0/route");
const lab3 = require("./lab3/route");
const lab4 = require("./lab4/route");
const lab5 = require("./lab5/route");

app.use("/0", lab0);
app.use("/3", lab3);
app.use("/4", lab4);
app.use("/5", lab5);

// Listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
