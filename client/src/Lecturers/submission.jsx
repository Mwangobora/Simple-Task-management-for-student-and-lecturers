import React, { useState, useEffect } from 'react';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all submissions when the component mounts
  useEffect(() => {
    const fetchSubmissions = async () => {
      console.log("Fetching all submissions..."); // Debugging line

      try {
        const response = await fetch('http://localhost:5000/submissions'); // Fetch all submissions

        // Check if the response is ok (status 200)
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Debugging line

        if (data && data.length > 0) {
          setSubmissions(data);
        } else {
          setSubmissions([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []); // Empty dependency array to only fetch once when component mounts

  if (loading) {
    return <p>Loading submissions...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (submissions.length === 0) {
    return <p>No submissions found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Submissions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="border border-gray-300 p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <p className="font-medium text-lg">Submitted By: {submission.submitted_by}</p>
            <p>Status: {submission.status}</p>
            <p>Submitted On: {new Date(submission.submission_date).toLocaleString()}</p>
            <a
              href={`http://localhost:5000/${submission.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View File
            </a>
          
          </div>
        ))}
      </div>
    </div>
  );
};

// Update submission status on the backend
const updateSubmissionStatus = async (submissionId, status) => {
  try {
    const response = await fetch(`http://localhost:5000/submissions/${submissionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Failed to update submission status');
      return;
    }

    // Successfully updated status
    alert('Submission status updated!');
  } catch (error) {
    console.error('Error updating submission status:', error);
    alert('Error updating submission status');
  }
};

export default Submissions;
