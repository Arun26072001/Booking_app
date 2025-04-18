const express = require("express");
const cors = require("cors");
const auth = require("./routers/auth");
const booking = require("./routers/booking");
const vehicle = require("./routers/vehicle");
const allotment = require("./routers/allotment");
const completeTrip = require("./routers/trip-complete");
const state = require("./routers/state");
const { imgUpload } = require("./controllers/ImgUpload");
const path = require("path");

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON payloads
// API Endpoints
app.get("/", (req, res) => {
    require("dns").resolve("www.google.com", function (err) {
        if (err) {
            res.status(1024).send("Network not Connected!");
        } else {
            res.send({ message: "API and Network connected!" });
        }
    });
});

app.use("/tripDocs", express.static(path.join(__dirname, "tripDocs")));

// Routers
app.use("/api/auth", auth);
app.use("/api/booking", booking);
app.use("/api/vehicle", vehicle);
app.use("/api/allotment", allotment);
app.use("/api/trip-complete", completeTrip);
app.use("/api/upload", imgUpload);
app.use("/api/state", state)

// Catch-all 404 Route
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
