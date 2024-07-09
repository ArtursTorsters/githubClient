GitHub Client
Overview

The GitHub Client allows you to perform Git operations such as initializing a new repository, adding files to the repository, committing changes, and checking the status of the repository. It's built using TypeScript to leverage type checking and modern JavaScript features during development.

TypeScript files in the src directory are compiled to JavaScript in the dist directory using the TypeScript compiler (tsc). This ensures compatibility with Node.js runtime.
Setup
Clone Repository and Install Dependencies

    Clone the Repository:

    bash

git clone <repository_url>
cd <repository_directory>

Install Dependencies:

    npm install

Compile TypeScript to JavaScript

If you have TypeScript files that need to be compiled to JavaScript:

npx tsc

This command compiles TypeScript files in the src directory to JavaScript files in the dist directory.
Usage
Git Operations Using gited.js

    Initialize a New Repository:

    swift

node dist/gited.js init <repo_name>

Navigate to the Repository Directory:

bash

cd <repo_name>

Create and Add Files:

    Create a new file and add content:

    bash

echo "Hello Coding Challenges" > test.txt

Add the file to the Git index:

bash

    node ../dist/gited.js add test.txt

Commit Changes:

bash

node ../dist/gited.js commit "Initial commit"

Check Repository Status:

bash

    node ../dist/gited.js status

These commands allow you to perform basic Git operations via the gited.js script. Modify the paths and commands based on your specific directory structure and requirements.
Running the Server and React Frontend

To run the GitHub Client with a frontend interface and server interaction:
Server Setup

    Navigate to Server Directory:

    bash

cd server

Install Dependencies:

npm install

Build TypeScript (if applicable):

arduino

npm run build

Start the Server:

arduino

    npm run start-server

    This command launches the backend server which interacts with the local Git repository (gited.ts). The server listens on http://localhost:3001.

React Frontend Setup

    Navigate to React Frontend Directory:

    bash

cd src/frontend

Install Dependencies:

npm install

Start the React Development Server:

sql

    npm start

    This command starts the React development server and opens the application in your default web browser at http://localhost:3000.

Application Usage

    Server Communication: The React frontend communicates with the Node.js server (http://localhost:3001) to execute Git operations such as initializing a repository, adding files, committing changes, and checking status.

    Git Operations: Use the provided UI to enter repository paths and perform Git operations. Each operation triggers a corresponding function (init, add, commit, status) on the server side, which in turn interacts with the local Git repository using the functions defined in gited.ts.

Directory Structure

    server/: Contains the Node.js backend server files.
    src/frontend/: Contains the React frontend files.