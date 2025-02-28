const express = require('express');
const router = express.Router();
const pool = require('../database');


// Create (POST) - Add a new student
router.post('/', async (req, res) => {
    const { id, course, year_of_study, registration_number } = req.body;
  
    if (!id || !course || !year_of_study || !registration_number) {
      return res.status(400).json({ error: 'All fields (id, course, year_of_study, registration_number) are required' });
    }
  
    try {
      const query = `
        INSERT INTO students (id, course, year_of_study, registration_number)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const values = [id, course, year_of_study, registration_number];
      const result = await pool.query(query, values);
  
      res.status(201).json({ message: 'Student added successfully', student: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add student' });
    }
  });
  
  router.get('/', async (req, res) => {
    try {
      const query = `
        SELECT students.*, users.username, users.email
        FROM students
        JOIN users ON students.id = users.id
        ORDER BY registration_number;
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });
  
  // Read (GET) - Get a specific student by ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = `
        SELECT students.*, users.username, users.email
        FROM students
        JOIN users ON students.id = users.id
        WHERE students.id = $1;
      `;
      const result = await pool.query(query, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch student' });
    }
  });
  
  // Update (PUT) - Update a student's details
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { course, year_of_study, registration_number } = req.body;
  
    try {
      const studentQuery = 'SELECT * FROM students WHERE id = $1;';
      const studentResult = await pool.query(studentQuery, [id]);
  
      if (studentResult.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      const query = `
        UPDATE students
        SET course = $1, year_of_study = $2, registration_number = $3
        WHERE id = $4 RETURNING *;
      `;
      const values = [
        course || studentResult.rows[0].course,
        year_of_study || studentResult.rows[0].year_of_study,
        registration_number || studentResult.rows[0].registration_number,
        id
      ];
  
      const result = await pool.query(query, values);
      res.status(200).json({ message: 'Student updated successfully', student: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update student' });
    }
  });
  
  // Delete (DELETE) - Remove a student by ID
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = 'DELETE FROM students WHERE id = $1 RETURNING *;';
      const result = await pool.query(query, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.status(200).json({ message: 'Student deleted successfully', student: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  });

  module.exports = router;