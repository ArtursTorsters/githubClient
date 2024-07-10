### GitHub Client

The GitHub Client allows you to perform Git operations such as initializing a new repository, adding files to the repository, committing changes, and checking the status of the repository. Additionally, it provides a React frontend to visualize commit history using Frappe Charts. It's built using TypeScript and React to leverage type checking and modern JavaScript features during development.

TypeScript files in the src directory are compiled to JavaScript in the dist directory using the TypeScript compiler (tsc). This ensures compatibility with Node.js runtime.

### Setup

Clone Repository and Install Dependencies

    Clone the Repository:

git clone <repository_url>
cd <repository_directory>

Install Dependencies:

    npm install

Compile TypeScript to JavaScript

If you have TypeScript files that need to be compiled to JavaScript:

npx tsc

This command compiles TypeScript files in the src directory to JavaScript files in the dist directory.

### Usage

Git Operations Using gited.js

Initialize a New Repository:

    node dist/gited.js init <repo_name>

Navigate to the Repository Directory:

    cd <repo_name>

Create a new file and add content:

    echo "Hello Coding Challenges" > test.txt

Add the file to the Git index:

    node ../dist/gited.js add test.txt

Commit Changes:

    node ../dist/gited.js commit "Initial commit"

Check Repository Status:

    node ../dist/gited.js status

These commands allow you to perform basic Git operations via the gited.js script. Modify the paths and commands based on your specific directory structure and requirements.

### React Frontend Setup

Navigate to React Frontend Directory:

    cd src/frontend

Install Dependencies:

    npm install

Start the React Development Server:

    npm start

    This command starts the React development server and opens the application in your default web browser at http://localhost:3000.

Application Usage

    View Commit History: The frontend visualizes the commit history using Frappe Charts. After fetching the commit data from the server, it displays a heatmap of commits similar to GitHub's contributions graph.
