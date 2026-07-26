const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// GET /api/patients?q=searchTerm
// Only accessible by doctors
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can access patient list' });
    }

    const q = (req.query.q || '').toString().trim();
    const filter = { role: 'patient' };

    if (q) {
      // search by name or email (case-insensitive)
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const patients = await User.find(filter).select('name email').limit(50).lean();

    res.json({ success: true, patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch patients', error: error.message });
  }
});

module.exports = router;
