# GitHub Client with TypeScript

This project is a simple implementation of basic Github client using Node.js and TypeScript.

## About

The GitHub Client allows you to perform Git operations such as initializing a new repository, adding files to the repository, committing changes, and checking the status of the repository. It's built using TypeScript to leverage type checking and modern JavaScript features during development.

TypeScript files in the src directory are compiled to JavaScript in the dist directory using the TypeScript compiler (tsc). This ensures compatibility with Node.js runtime.

## Setup

  * git clone <repository_url>
  * cd <repository_directory>
  * npm install

## Compile TypeScript to JavaScript

   npx tsc

## Usage

* node dist/gited.js init <repo_name>
* cd <repo_name>
* echo "Hello Coding Challenges" > test.txt
* node ../dist/gited.js add test.txt

* node ../dist/gited.js commit "Initial commit"
* node ../dist/gited.js status

