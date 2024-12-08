"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Cors dependecy
app.use(cors());
app.use(express.json());

// Database connection
let db;
async function connectToDatabase() {
    try {
        const client = new MongoClient(process.env.MONGODB_URL);
        await client.connect();
        db = client.db("Portfolio");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}

// API Endpoints
// Add the route to get all projects
app.get("/api/projects", async (req, res) => {
    try {
        const projects = await db.collection("Projects").find().toArray();
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects", error);
        res.status(500).send("Error fetching projects");
    }
});

// Add route to get a specific project by ID
app.get("/api/projects/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid project ID" });
        }

        // Find project by ID
        const project = await db.collection("Projects").findOne({ _id: new ObjectId(id) });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Error fetching project" });
    }
});




// Start server
app.listen(port, async () => {
    await connectToDatabase();
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Port${port}`);
});
