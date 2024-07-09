import express from 'express';
import axios from 'axios';

const app = express();

const githubToken = ''; // Replace with your GitHub access token

// Function to fetch all commit history for a single repository
async function commitHistory(repoName: string): Promise<any[]> {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repoName}/commits`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    return response.data.map((commit: any) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      repo: repoName,
    }));
  } catch (error) {
    console.error(`Error fetching commit history for ${repoName}:`, error);
    return [];
  }
}

// API endpoint to fetch all commit history from all GitHub repositories
app.get('/api/github/all-commit-history', async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    const allRepos = response.data;
    let allCommits: any[] = [];

    // Fetch commit history for each repository
    for (const repo of allRepos) {
      const repoName = repo.full_name;
      const commits = await commitHistory(repoName);
      allCommits = [...allCommits, ...commits];
    }

    res.json(allCommits);
  } catch (error) {
    console.error('Error fetching all GitHub commit history:', error);
    res.status(500).json({ error: 'Failed to fetch all commit history from GitHub' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});