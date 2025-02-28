create database task_management_system;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('lecturer', 'student', 'user')) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lecturers (
    id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    phone_number VARCHAR(15)
);

CREATE TABLE students (
    id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(250)
    course VARCHAR(100) NOT NULL,
    year_of_study INT CHECK (year_of_study > 0 AND year_of_study <= 10),
    registration_number VARCHAR(50) UNIQUE NOT NULL
);

    CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    deadline TIMESTAMP NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'overdue')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    submitted_by INT REFERENCES users(id) ON DELETE CASCADE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('submitted', 'rejected', 'approved')) DEFAULT 'submitted'
);


INSERT INTO users (username, password, role, email) VALUES
('lecturer1', 'password123', 'lecturer', 'lecturer1@example.com'),
('student1', 'password123', 'student', 'student1@example.com'),
('admin1', 'password123', 'admin', 'admin1@example.com'),
('lecturer2', 'password123', 'lecturer', 'lecturer2@example.com'),
('student2', 'password123', 'student', 'student2@example.com');

INSERT INTO lecturers (id, department, qualification, phone_number) VALUES
(1, 'Computer Science', 'PhD in AI', '1234567890'),
(4, 'Mathematics', 'PhD in Algebra', '1234567891');

INSERT INTO students (id, course, year_of_study, registration_number) VALUES
(2, 'Software Engineering', 2, 'SE2021001'),
(5, 'Electrical Engineering', 3, 'EE2021002');

INSERT INTO tasks (title, description, assigned_to, created_by, deadline, status) VALUES
('Assignment 1', 'Solve AI problems', 2, 1, '2025-02-15 23:59:59', 'pending'),
('Project 1', 'Build a database schema', 2, 1, '2025-03-01 23:59:59', 'pending'),
('Quiz 1', 'Complete the online quiz', 2, 1, '2025-02-05 23:59:59', 'completed'),
('Assignment 2', 'Solve math problems', 5, 4, '2025-02-20 23:59:59', 'pending'),
('Final Project', 'Develop a web application', NULL, 1, '2025-05-01 23:59:59', 'pending');

INSERT INTO submissions (task_id, submitted_by, file_path) VALUES
(1, 2, '/uploads/assignment1_student1.pdf'),
(2, 2, '/uploads/project1_student1.zip'),
(3, 2, '/uploads/quiz1_student1.txt'),
(4, 5, '/uploads/assignment2_student2.pdf'),
(5, NULL, NULL);
