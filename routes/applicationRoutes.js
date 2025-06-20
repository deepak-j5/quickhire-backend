const express = require("express");
const router = express.Router();
const { applyToJob } = require("../controllers/applicationController");
const protect = require("../middleware/authMiddleware");

// Protected route
router.post("/:id", protect, applyToJob);

module.exports = router;
