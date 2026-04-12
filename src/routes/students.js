const express = require('express');
const Student = require('../models/Student');

const router = express.Router();

// GET /api/students?q=searchTerm
router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { team: { $regex: q, $options: 'i' } },
      ];
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
});

// GET /api/students/:id
router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Studerende ikke fundet' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

// POST /api/students
router.post('/', async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email findes allerede' });
    }
    next(error);
  }
});

// PUT /api/students/:id
router.put('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ message: 'Studerende ikke fundet' });
    }

    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email findes allerede' });
    }
    next(error);
  }
});

// DELETE /api/students/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Studerende ikke fundet' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
