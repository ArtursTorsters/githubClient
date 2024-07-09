import axios from 'axios';

export const fetchCommits = async () => {
  try {
    const githubToken = ''
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
      const commitsResponse = await axios.get(`https://api.github.com/repos/${repoName}/commits`, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      });

      const commits = commitsResponse.data.map((commit: any) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        repo: repoName,
      }));

      allCommits = [...allCommits, ...commits];
    }

    return allCommits;
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
};
