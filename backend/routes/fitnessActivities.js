const express = require('express');
const router = express.Router();
const FitnessActivity = require('../models/FitnessActivity');

// Add a new fitness activity
router.post('/', async (req, res) => {
    try {
        const activity = new FitnessActivity(req.body);
        await activity.save();
        res.status(201).json(activity);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get today's fitness activities
router.get('/today', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activities = await FitnessActivity.find({ date: { $gte: today } });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
