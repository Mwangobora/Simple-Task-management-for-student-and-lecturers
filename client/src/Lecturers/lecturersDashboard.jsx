import React, { useState, useEffect } from 'react';
import Submissions from './submission';
import Tasks from './task';
import { Link } from 'react-router-dom';

const LectureDashboard = ({ lecturerId }) => {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState('tasks'); // Track the current section

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    setSelectedTaskId(null); // Clear selected task when switching to tasks section
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Lecturer Dashboard</h1>

      {/* Navigation Bar */}
      <div className="mb-6">
        <button
          onClick={() => handleSectionChange('tasks')}
          className={`mr-4 py-2 px-4 rounded ${currentSection === 'tasks' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Tasks
        </button>

        <button
          onClick={() => handleSectionChange('submissions')}
          className={`py-2 px-4 rounded ${currentSection === 'submissions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Submissions
        </button>

        <button
          onClick={() => handleSectionChange('createTask')}
          className={`py-2 px-4 rounded ${currentSection === 'createTask' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Create Task
        </button>
        <Link 
                to="/sign-in" 
                className="py-2 px-4 rounded bg-gray-200}"
              >
                Logout
              </Link> 
      </div>

      {currentSection === 'tasks' && (
        <div>
          {/* Loading and Error Handling */}
          {loading && <p>Loading tasks...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Task List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <p className="text-gray-600">{task.description}</p>
                  <button
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setCurrentSection('submissions'); // Switch to submissions when a task is selected
                    }}
                    className="mt-3 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    View Submissions
                  </button>
                </div>
              ))
            ) : (
              <p>No tasks available. Please create a task.</p>
            )}
          </div>
        </div>
      )}

      {/* Display Task Creation Form when "Create Task" is Selected */}
      {currentSection === 'createTask' && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Create a New Task</h2>
          <Tasks tasks={tasks} onCreateTask={fetchTasks} /> {/* Pass the fetchTasks function to update task list */}
        </div>
      )}

      {/* Display Submissions Only When "Submissions" is Selected and a Task is Selected */}
      {currentSection === 'submissions' && selectedTaskId && (
        <div className="mt-8">
          <Submissions taskId={selectedTaskId} />
        </div>
      )}
    </div>
  );
};

export default LectureDashboard;
