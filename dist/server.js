"use strict";
//The server.ts file is used to create a backend server 
//that can handle requests from your React frontend. 
//This server can interact with your Git repository, fetch data, and serve it to the React 
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { init, add, commit, status } from './gited.js';
// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(cors());
// app.use(bodyParser.json());
// app.post('/init', (req, res) => {
//   const { repoPath } = req.body;
//   try {
//     init(repoPath);
//     res.status(200).send('Repository initialized successfully');
//   } catch (error) {
//     res.status(500).send(`Error initializing repository: ${error}`);
//   }
// });
// app.post('/add', (req, res) => {
//   const { repoPath, filePath } = req.body;
//   try {
//     add(repoPath, filePath);
//     res.status(200).send('File added successfully');
//   } catch (error) {
//     res.status(500).send(`Error adding file: ${error}`);
//   }
// });
// app.post('/commit', (req, res) => {
//   const { repoPath, message } = req.body;
//   try {
//     commit(repoPath, message);
//     res.status(200).send('Changes committed successfully');
//   } catch (error) {
//     res.status(500).send(`Error committing changes: ${error}`);
//   }
// });
// app.get('/status', (req, res) => {
//   const { repoPath } = req.query;
//   try {
//     const repoStatus = status(repoPath as string);
//     res.status(200).json(repoStatus);
//   } catch (error) {
//     res.status(500).send(`Error getting status: ${error}`);
//   }
// });
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
