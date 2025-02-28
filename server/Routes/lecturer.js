const express = require('express');
const router = express.Router();
const pool = require('../database');

router.post('/', async (req, res) => {
  const { id, department, qualification, phone_number } = req.body;

  if (!id || !department) {
    return res.status(400).json({ error: 'ID and department are required.' });
  }

  try {
    const query = `
      INSERT INTO lecturers (id, department, qualification, phone_number)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [id, department, qualification || null, phone_number || null];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Lecturer added successfully.', lecturer: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add lecturer.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT lecturers.*, users.username, users.email
      FROM lecturers
      JOIN users ON lecturers.id = users.id
      ORDER BY department;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch lecturers.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT lecturers.*, users.username, users.email
      FROM lecturers
      JOIN users ON lecturers.id = users.id
      WHERE lecturers.id = $1;
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lecturer not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch lecturer.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { department, qualification, phone_number } = req.body;

  try {
    const lecturerQuery = 'SELECT * FROM lecturers WHERE id = $1;';
    const lecturerResult = await pool.query(lecturerQuery, [id]);

    if (lecturerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lecturer not found.' });
    }

    const query = `
      UPDATE lecturers
      SET department = $1, qualification = $2, phone_number = $3
      WHERE id = $4 RETURNING *;
    `;
    const values = [
      department || lecturerResult.rows[0].department,
      qualification || lecturerResult.rows[0].qualification,
      phone_number || lecturerResult.rows[0].phone_number,
      id,
    ];

    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Lecturer updated successfully.', lecturer: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update lecturer.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM lecturers WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lecturer not found.' });
    }

    res.status(200).json({ message: 'Lecturer deleted successfully.', lecturer: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete lecturer.' });
  }
});

module.exports = router;
