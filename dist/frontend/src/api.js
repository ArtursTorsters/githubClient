var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
export const fetchCommits = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const githubToken = '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'; // Replace with your actual GitHub token
        const response = yield axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${githubToken}`,
            },
        });
        const allRepos = response.data;
        let allCommits = [];
        // Fetch commit history for each repository
        for (const repo of allRepos) {
            const repoName = repo.full_name;
            const commitsResponse = yield axios.get(`https://api.github.com/repos/${repoName}/commits`, {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                },
            });
            const commits = commitsResponse.data.map((commit) => ({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                repo: repoName,
            }));
            allCommits = [...allCommits, ...commits];
        }
        return allCommits;
    }
    catch (error) {
        console.error('Error fetching commits:', error);
        return [];
    }
});
