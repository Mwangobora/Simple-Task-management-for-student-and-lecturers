const express = require('express');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../database');


const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  const { task_id, submitted_by } = req.body;
  const file_path = req.file ? req.file.path : null;

  if (!task_id || !submitted_by || !file_path) {
    return res.status(400).json({ error: 'Missing required fields: task_id, submitted_by, or file' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO submissions (task_id, submitted_by, file_path) VALUES ($1, $2, $3) RETURNING *',
      [task_id, submitted_by, file_path]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});


router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM submissions');

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No submissions found' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Missing required field: status' });
  }

  try {
    const result = await pool.query(
      'UPDATE submissions SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ error: 'Failed to update submission status' });
  }
});

module.exports = router;
