const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Connect database, ensure table is created and connection is secured.
require("./server/db/User");

app.use(cors());

// Parse req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statically Serve Public files in src directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", require("./server/api/index"));

app.listen(8080, () => console.log("server: listening on port 8080"));
