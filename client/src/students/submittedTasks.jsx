import React, { useEffect, useState } from 'react';

const SubmittedTasks = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('http://localhost:5000/submissions'); 
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Submitted Tasks</h2>
      <ul className="space-y-4">
        {submissions.map((submission) => (
          <li key={submission.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="font-semibold">Task ID: {submission.task_id}</h3>
            <p>Status: {submission.status}</p>
            <p className="text-sm text-gray-500">Submitted On: {submission.submission_date}</p>
            {submission.file_path && (
              <a href={`http://localhost:5000/${submission.file_path}`} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                View Submission
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmittedTasks;
