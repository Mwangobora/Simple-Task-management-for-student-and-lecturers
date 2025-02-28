import React, { useState, useEffect, Fragment } from 'react';

const SubmitTask = () => {
  const [id,setId] = useState(''); 
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState(''); 
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleId = (e)=>{
    setId(e.target.value)
  }

  
  const submitTask = async (e) => {
    e.preventDefault();

    if (!file || !id || !userId) {
      setError('Please provide all fields: file, task ID, and user ID.');
      return;
    }

    const formData = new FormData();
    formData.append('task_id', id); 
    formData.append('submitted_by', userId);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/submissions', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Task submitted successfully!');
        setError(null); 
      } else {
        setSuccessMessage('');
        setError(data.error || 'Failed to submit task');
      }
    } catch (err) {
      alert("no submitted task")
    }
  };

  return (
    <Fragment>
      <div className="max-w-lg mx-auto p-6 bg-white border rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Submit Task for {id}</h2> {/* Show taskId */}
        
        <form onSubmit={submitTask}>
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <div className="mb-4">
            <label htmlFor="taskId" className="block text-sm font-medium text-gray-700">Task ID</label>
            <input
              type="text"
              id="taskId"
              value={id}
              onChange={handleId}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload File</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">Your User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit Task
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default SubmitTask;
