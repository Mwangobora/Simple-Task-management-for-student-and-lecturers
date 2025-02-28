const express = require('express');
const router = express.Router();
const pool = require('../database');

router.post('/', async (req, res) => {
  const { title, description, assigned_to, created_by, deadline, status } = req.body;

  if (!title || !deadline || !created_by) {
    return res.status(400).json({ error: 'Title, deadline, and created_by are required' });
  }

  try {
    const query = `
      INSERT INTO tasks (title, description, assigned_to, created_by, deadline, status)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [title, description, assigned_to || null, created_by, deadline, status || 'pending'];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Task created successfully', task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});


router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT tasks.*, 
             u1.username AS assigned_to_user, 
             u2.username AS created_by_user
      FROM tasks
      LEFT JOIN users u1 ON tasks.assigned_to = u1.id
      LEFT JOIN users u2 ON tasks.created_by = u2.id
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT tasks.*, 
             u1.username AS assigned_to_user, 
             u2.username AS created_by_user
      FROM tasks
      LEFT JOIN users u1 ON tasks.assigned_to = u1.id
      LEFT JOIN users u2 ON tasks.created_by = u2.id
      WHERE tasks.id = $1;
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, assigned_to, deadline, status } = req.body;

  try {
    const taskQuery = 'SELECT * FROM tasks WHERE id = $1;';
    const taskResult = await pool.query(taskQuery, [id]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const query = `
      UPDATE tasks
      SET title = $1, description = $2, assigned_to = $3, deadline = $4, status = $5
      WHERE id = $6 RETURNING *;
    `;
    const values = [
      title || taskResult.rows[0].title,
      description || taskResult.rows[0].description,
      assigned_to || taskResult.rows[0].assigned_to,
      deadline || taskResult.rows[0].deadline,
      status || taskResult.rows[0].status,
      id
    ];

    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Task updated successfully', task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});


module.exports = router;
