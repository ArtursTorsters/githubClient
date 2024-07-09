// npx tsc to compile TS to JS
// node dist/gited.js init test-repo
// cd test-repo
// echo "Hello Coding Challenges" > hello-coding-challenges.txt
// echo "Another Coding Challenge" > another-coding-challenge.txt
// node ../dist/gited.js add hello-coding-challenges.txt
// node ../dist/gited.js add another-coding-challenge.txt
// node ../dist/gited.js commit "Initial commit"
// node ../dist/gited.js status
// pushing to repo from the folder like test-repo
// node ../dist/gited.js remote origin https://github.com/ArtursTorsters/test.git
// node ../dist/gited.js push origin master username HTTPs access token
//  added modules for node.js , otherwise wont run
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from "fs";
import path from "path";
import crypto from "crypto";
import zlib from "zlib";
const GIT_DIR = ".git";
// Utility function to write an object to the object database
export function writeObject(type, content) {
    const header = `${type} ${content.length}\0`;
    const store = Buffer.concat([Buffer.from(header), content]);
    const sha1 = crypto.createHash("sha1").update(store).digest("hex");
    const dir = path.join(GIT_DIR, "objects", sha1.slice(0, 2));
    const filePath = path.join(dir, sha1.slice(2));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, zlib.deflateSync(store));
    return sha1;
}
// Initialize an empty git repository
export function init(repoPath) {
    const gitPath = path.join(repoPath, GIT_DIR);
    if (fs.existsSync(gitPath)) {
        console.log("Git repository already initialized.");
        return;
    }
    fs.mkdirSync(repoPath, { recursive: true });
    fs.mkdirSync(gitPath);
    fs.writeFileSync(path.join(gitPath, "HEAD"), "ref: refs/heads/master\n");
    fs.writeFileSync(path.join(gitPath, "config"), "[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n\tbare = false\n\tlogallrefupdates = true\n");
    fs.writeFileSync(path.join(gitPath, "description"), "Unnamed repository; edit this file 'description' to name the repository.\n");
    fs.mkdirSync(path.join(gitPath, "hooks"));
    fs.mkdirSync(path.join(gitPath, "objects"));
    fs.mkdirSync(path.join(gitPath, "refs"));
    fs.mkdirSync(path.join(gitPath, "refs/heads"));
    console.log(`Initialized empty repository: ${repoPath}`);
}
// Add file(s) to the index
export function add(repoPath, filePath) {
    const relativeFilePath = path.relative(repoPath, filePath);
    const fileContent = fs.readFileSync(filePath);
    const fileHash = writeObject("blob", fileContent);
    const indexPath = path.join(repoPath, GIT_DIR, "index");
    const indexEntry = `${fileHash} ${relativeFilePath}\n`;
    fs.appendFileSync(indexPath, indexEntry);
    console.log(`Added ${relativeFilePath} to index.`);
}
// Create a tree object from the index entries
export function createTree(repoPath) {
    const indexPath = path.join(repoPath, GIT_DIR, "index");
    const indexEntries = fs.existsSync(indexPath)
        ? fs.readFileSync(indexPath, "utf-8").split("\n").filter(Boolean)
        : [];
    let treeContent = "";
    indexEntries.forEach((entry) => {
        const [fileHash, relativeFilePath] = entry.split(" ");
        treeContent += `100644 blob ${fileHash}\t${relativeFilePath}\n`;
    });
    return writeObject("tree", Buffer.from(treeContent));
}
// Commit the staged changes
export function commit(repoPath, message) {
    const treeHash = createTree(repoPath);
    const headPath = path.join(repoPath, GIT_DIR, "HEAD");
    const headContent = fs.readFileSync(headPath, "utf-8").trim();
    const branchPath = path.join(repoPath, GIT_DIR, headContent.split(" ")[1]);
    let parentHash = null;
    if (fs.existsSync(branchPath)) {
        parentHash = fs.readFileSync(branchPath, "utf-8").trim();
    }
    else {
        // Create the branch file if it doesn't exist
        fs.writeFileSync(branchPath, "");
    }
    const author = "Arturs <test.noreply.github.com>";
    const date = new Date().toISOString();
    let commitContent = `tree ${treeHash}\n`;
    if (parentHash) {
        commitContent += `parent ${parentHash}\n`;
    }
    commitContent += `author ${author} ${Math.floor(Date.now() / 1000)} +0000\n`;
    commitContent += `committer ${author} ${Math.floor(Date.now() / 1000)} +0000\n\n`;
    commitContent += `${message}\n`;
    const commitHash = writeObject("commit", Buffer.from(commitContent));
    fs.writeFileSync(branchPath, commitHash);
    console.log(`Committed to master: ${commitHash}`);
}
// Show the status of the repository
export function status(repoPath) {
    const indexPath = path.join(repoPath, GIT_DIR, "index");
    const indexEntries = fs.existsSync(indexPath)
        ? fs.readFileSync(indexPath, "utf-8").split("\n").filter(Boolean)
        : [];
    const trackedFiles = new Set(indexEntries.map((entry) => entry.split(" ")[1]));
    const currentFiles = new Set(fs.readdirSync(repoPath).filter((file) => file !== GIT_DIR));
    console.log("On branch master\n");
    console.log("Changes to be committed:");
    for (const entry of indexEntries) {
        const [fileHash, relativeFilePath] = entry.split(" ");
        const absoluteFilePath = path.join(repoPath, relativeFilePath);
        if (fs.existsSync(absoluteFilePath)) {
            const fileContent = fs.readFileSync(absoluteFilePath);
            const currentHash = crypto
                .createHash("sha1")
                .update(`blob ${fileContent.length}\0${fileContent}`)
                .digest("hex");
            if (currentHash === fileHash) {
                console.log(`\tfile:   ${relativeFilePath}`);
            }
        }
    }
    console.log("\nUntracked files:");
    for (const file of currentFiles) {
        if (!trackedFiles.has(file)) {
            console.log(`\t${file}`);
        }
    }
}
// Add a function to set the remote URL in your local Git repository:
const { execSync } = require('child_process');
export function setRemote(repoPath, remoteName, remoteUrl) {
    const configPath = path.join(repoPath, GIT_DIR, 'config');
    let configContent = fs.readFileSync(configPath, 'utf-8');
    configContent += `[remote "${remoteName}"]
    url = ${remoteUrl}
    fetch = +refs/heads/*:refs/remotes/${remoteName}/*
    `;
    fs.writeFileSync(configPath, configContent);
    console.log(`Remote ${remoteName} added with URL: ${remoteUrl}`);
}
// Add a function to push commits to the remote repository. This involves packing objects and sending them over HTTP/HTTPS:
const https = require('https');
const { spawnSync } = require('child_process');
const { URL } = require('url');
export function push(repoPath, remoteName, branch, username, token) {
    try {
        const configPath = path.join(repoPath, '.git', 'config');
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const remoteUrlMatch = configContent.match(new RegExp(`url = (.+)`, 'm'));
        if (!remoteUrlMatch) {
            console.error(`Remote URL for ${remoteName} not found in config.`);
            return;
        }
        let remoteUrl = remoteUrlMatch[1];
        if (remoteUrl.startsWith('git@')) {
            remoteUrl = remoteUrl.replace(':', '/').replace('git@', 'https://');
        }
        const parsedUrl = new URL(remoteUrl);
        const auth = `${username}:${token}`;
        const authHeader = 'Basic ' + Buffer.from(auth).toString('base64');
        // Create a pack file
        console.log('Creating pack file...');
        // const packFile = path.join(repoPath, GIT_DIR, 'objects', 'pack', 'pack-' + Date.now());
        // const packResult = spawnSync('git', ['pack-objects', '--all-progress', packFile], { cwd: repoPath, stdio: 'inherit' });
        console.log('Creating pack file...');
        const packFile = path.join(repoPath, GIT_DIR, 'objects', 'pack', 'pack-' + Date.now());
        console.log('Pack file path:', packFile);
        // const packResult = spawnSync('git', ['pack-objects', '--all-progress', packFile], { cwd: repoPath, stdio: 'inherit' });
        const command = `git pack-objects --all-progress ${packFile}`;
        console.log('Executing command:', command);
        const packResult = execSync(command, { cwd: repoPath, stdio: 'inherit' });
        console.log('packResult:', packResult);
        if (packResult.error) {
            console.error(`Error creating pack file: ${packResult.error.message}`);
            return;
        }
        if (packResult.status !== 0) {
            console.error(`git pack-objects failed with status: ${packResult.status}`);
            return;
        }
        // Read pack file content
        console.log('Reading pack file...');
        const packData = fs.readFileSync(packFile + '.pack');
        // Create the HTTP request
        console.log('Creating HTTP request...');
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + '/info/refs?service=git-receive-pack',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-git-upload-pack-request',
                'Content-Length': packData.length,
                'Authorization': authHeader
            },
            timeout: 30000 // 30 seconds timeout
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log('Response:', data);
            });
        });
        req.setTimeout(90000, () => {
            console.error('Request timed out.');
            req.abort();
        });
        req.on('timeout', () => {
            console.error('Request timed out.');
            req.abort();
        });
        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
        });
        // Write pack data
        console.log('Sending pack data...');
        req.write(packData);
        req.end();
    }
    catch (error) {
        console.error(`Error in push function: ${error}`);
    }
}
// Main CLI entry point
const [command, ...args] = process.argv.slice(2);
const repoPath = process.cwd();
switch (command) {
    case "init":
        if (args.length === 0) {
            console.error("Please specify the directory to initialize.");
        }
        else {
            init(path.join(repoPath, args[0]));
        }
        break;
    case "add":
        if (args.length === 0) {
            console.error("Please specify files to add.");
        }
        else {
            args.forEach((filePath) => add(repoPath, path.join(repoPath, filePath)));
        }
        break;
    case "commit":
        if (args.length === 0) {
            console.error("Please provide a commit message.");
        }
        else {
            commit(repoPath, args.join(" "));
        }
    case 'remote':
        if (args.length < 2) {
            console.error('Please specify the remote name and URL.');
        }
        else {
            setRemote(repoPath, args[0], args[1]);
        }
        break;
    case 'push':
        if (args.length < 4) {
            console.error('Please provide remote name, branch, username, and token.');
        }
        else {
            push(repoPath, args[0], args[1], args[2], args[3]);
        }
        break;
    case "status":
        status(repoPath);
        break;
    default:
        console.log(`Unknown command: ${command}`);
}
