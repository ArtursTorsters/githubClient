import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommitHistory = () => {
  const [commitHistory, setCommitHistory] = useState([]);

  useEffect(() => {
    // Fetch all commit history from backend API
    axios.get('/api/github/all-commit-history')
      .then(response => {
        setCommitHistory(response.data);
        console.log (response.data);
      })
      .catch(error => {
        console.error('Error fetching all commit history:', error);
      });
  }, []);

  return (
    <div>
      <h2>GitHub Commit History</h2>
      <div className="commit-graph">
        {/* Use a charting library (e.g., chart.js) to render the commit history */}
        {/* Example: Replace with your chart rendering logic */}
        {/* <ul>
          {commitHistory.map(commit => (
            <li key={commit.sha}>
              <div>{commit.sha}</div>
              <div>{commit.message}</div>
              <div>{commit.author}</div>
              <div>{commit.date}</div>
              <div>{commit.repo}</div>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default CommitHistory;
