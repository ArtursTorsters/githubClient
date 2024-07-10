import React, { useEffect, useState } from 'react';
import { fetchCommits } from './api';
import { Chart } from 'frappe-charts'
// import css

interface Commit {
  date: any;
  repo: string;
  message: string;
  commitCount: number;
}
interface HeatmapData {
  [date: string]: number;
}


const App = () => {
  const [commits, setCommits] = useState<Commit[]>([]);

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

  useEffect(() => {
    if (commits.length > 0) {
      // Transform commits data into heatmap data structure
      const heatmapData: HeatmapData = commits.reduce((acc, commit) => {
        const date = new Date(commit.date).toISOString().split('T')[0]
        if (acc[date]) {
          acc[date] += 1; // Increment commit count for existing date
        } else {
          acc[date] = 1; // Initialize commit count for new date
        }
        return acc;
      }, {} as HeatmapData)

      console.log('HEATMAP DATA with commit count for each day', heatmapData)

      const chart = new Chart("#chart", {
        type: 'heatmap',
        data: {
          dataPoints: heatmapData
        },
        height: 250,
        colors: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
      });
    }
  }, [commits]);

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-400'>
      <h1 className='text-white text-center mb-8 font-bold text-xl'>GitHub Commit History</h1>
      <div className='items-center align-bottom' id="chart"></div>
 
    </div>
  );
};

export default App;