import React, { useEffect, useState } from 'react';
import { fetchCommits } from './api';

const App = () => {
  const [commits, setCommits] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commitsData = await fetchCommits();
        console.log('Fetched commits:', commitsData);
        setCommits(commitsData);
      } catch (error) {
        console.error('Error fetching commits:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>GitHub Commit History</h1>
      <ul>
        {commits.map((commit, index) => (
          <li key={index}>
            <strong>{commit.repo}</strong> - {commit.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
