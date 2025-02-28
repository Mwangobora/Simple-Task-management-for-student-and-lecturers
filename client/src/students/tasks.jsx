import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';

const TasksFromLectures = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from the backend
  const getTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      console.log(data)
      setTasks(data);
   
    } catch (err) {
      setError('There was an issue fetching the tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Fragment>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Tasks from Lecturers
        </h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks available</p>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-300 p-5 rounded-lg shadow-lg hover:shadow-xl transition duration-300 bg-white"
              >
                <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
                
                <p className="text-gray-700">{task.description}</p>

                <p className="text-gray-700">Task ID is {task.id}</p>

              
              </div>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default TasksFromLectures;
