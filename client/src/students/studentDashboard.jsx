import React, { Fragment } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import TasksFromLectures from './tasks';
import SubmitTask from './submit';
import SubmittedTasks from './submittedTasks';


const StudentDashboard = () => {
  return (
    <Fragment>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-indigo-700 text-white p-4 shadow-lg md:h-screen">
          <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Dashboard</h2>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/student-dashboard/tasks" 
                className="block p-2 rounded-lg transition duration-300 hover:bg-indigo-500 hover:scale-105"
              >
                📋 View Tasks
              </Link>
            </li>
            <li>
              <Link 
                to="/student-dashboard/submit-task" 
                className="block p-2 rounded-lg transition duration-300 hover:bg-indigo-500 hover:scale-105"
              >
                📤 Submit Task
              </Link>
            </li>
            <li>
              <Link 
                to="/student-dashboard/submitted" 
                className="block p-2 rounded-lg transition duration-300 hover:bg-indigo-500 hover:scale-105"
              >
                ✅ Submitted Tasks
              </Link>
              <Link 
                to="/sign-in" 
                className="block p-2 rounded-lg transition duration-300 hover:bg-indigo-500 hover:scale-105"
              >
                Logout
              </Link>              
            </li>
          </ul>
        </div>

  
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Routes>
            <Route path="tasks" element={<TasksFromLectures />} />
            <Route path="submit-task" element={<SubmitTask />} />
            <Route path="submitted" element={<SubmittedTasks />} />

          </Routes>
        </div>
      </div>
    </Fragment>
  );
};

export default StudentDashboard;
