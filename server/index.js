const cors = require('cors');
const express = require('express');
const path = require('path');
const pool = require('./database')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const userApi = require('./Routes/users');
const studentApi = require('./Routes/students');
const lecturerApi = require('./Routes/lecturer');
const submissionApi = require('./Routes/submissions');
const taskApi = require('./Routes/tasks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // user login

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
       
     
        
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
  
        
        const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, 'your-secret-key', { expiresIn: '1h' });
  
       
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
  });
  
  //routes
app.use('/users', userApi);
app.use('/students', studentApi);
app.use('/lecturers', lecturerApi);
app.use('/submissions', submissionApi);
app.use('/tasks', taskApi);


const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
