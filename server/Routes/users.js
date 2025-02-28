const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


router.post('/', async (req, res) => {
    const { username, password, role, email } = req.body;
  
    if (!username || !password || !role || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
        INSERT INTO users (username, password, role, email)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const values = [username, hashedPassword, role, email];
      const result = await pool.query(query, values);      
  
      res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
    } catch (error) {
      
      console.error(error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });


  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users;');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });
  

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, role, email } = req.body;
  
    try {
      const userQuery = 'SELECT * FROM users WHERE id = $1;';
      const userResult = await pool.query(userQuery, [id]);
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const hashedPassword = password ? await bcrypt.hash(password, 10) : userResult.rows[0].password;
      const query = `
        UPDATE users
        SET username = $1, password = $2, role = $3, email = $4
        WHERE id = $5 RETURNING *;
      `;
      const values = [
        username || userResult.rows[0].username,
        hashedPassword,
        role || userResult.rows[0].role,
        email || userResult.rows[0].email,
        id
      ];
  
      const result = await pool.query(query, values);
      res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });
  
  
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
      const result = await pool.query(query, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });
  

  module.exports = router;

