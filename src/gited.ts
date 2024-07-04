// 
// node dist/gited.js init test-repo
// cd test-repo

// echo "Hello Coding Challenges" > hello-coding-challenges.txt
// echo "Another Coding Challenge" > another-coding-challenge.txt

// node ../dist/gited.js add hello-coding-challenges.txt
// node ../dist/gited.js add another-coding-challenge.txt

// node ../dist/gited.js commit "Initial commit"

// node ../dist/gited.js status




import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';

const GIT_DIR = '.git';




// Utility function to write an object to the object database
function writeObject(type: string, content: Buffer): string {
    const header = `${type} ${content.length}\0`;
    const store = Buffer.concat([Buffer.from(header), content]);
    const sha1 = crypto.createHash('sha1').update(store).digest('hex');
    const dir = path.join(GIT_DIR, 'objects', sha1.slice(0, 2));
    const filePath = path.join(dir, sha1.slice(2));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, zlib.deflateSync(store));
    return sha1;
}




// Initialize an empty git repository
function init(repoPath: string): void {
    const gitPath = path.join(repoPath, GIT_DIR);
    
    if (fs.existsSync(gitPath)) {
        console.log('Git repository already initialized.');
        return;
    }

    fs.mkdirSync(repoPath, { recursive: true });
    fs.mkdirSync(gitPath);
    fs.writeFileSync(path.join(gitPath, 'HEAD'), 'ref: refs/heads/master\n');
    fs.writeFileSync(path.join(gitPath, 'config'), '[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n\tbare = false\n\tlogallrefupdates = true\n');
    fs.writeFileSync(path.join(gitPath, 'description'), 'Unnamed repository; edit this file \'description\' to name the repository.\n');
    fs.mkdirSync(path.join(gitPath, 'hooks'));
    fs.mkdirSync(path.join(gitPath, 'objects'));
    fs.mkdirSync(path.join(gitPath, 'refs'));
    fs.mkdirSync(path.join(gitPath, 'refs/heads'));

    console.log(`Initialized empty repository: ${repoPath}`);
}




// Add file(s) to the index
function add(repoPath: string, filePath: string): void {
    const relativeFilePath = path.relative(repoPath, filePath);
    const fileContent = fs.readFileSync(filePath);
    const fileHash = writeObject('blob', fileContent);

    const indexPath = path.join(repoPath, GIT_DIR, 'index');
    const indexEntry = `${fileHash} ${relativeFilePath}\n`;
    fs.appendFileSync(indexPath, indexEntry);

    console.log(`Added ${relativeFilePath} to index.`);
}



// Create a tree object from the index entries
function createTree(repoPath: string): string {
    const indexPath = path.join(repoPath, GIT_DIR, 'index');
    const indexEntries = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf-8').split('\n').filter(Boolean) : [];

    let treeContent = '';
    indexEntries.forEach(entry => {
        const [fileHash, relativeFilePath] = entry.split(' ');
        treeContent += `100644 blob ${fileHash}\t${relativeFilePath}\n`;
    });

    return writeObject('tree', Buffer.from(treeContent));
}




// Commit the staged changes
function commit(repoPath: string, message: string): void {
    const treeHash = createTree(repoPath);

    const headPath = path.join(repoPath, GIT_DIR, 'HEAD');
    const headContent = fs.readFileSync(headPath, 'utf-8').trim();
    const branchPath = path.join(repoPath, GIT_DIR, headContent.split(' ')[1]);

    let parentHash: string | null = null;
    if (fs.existsSync(branchPath)) {
        parentHash = fs.readFileSync(branchPath, 'utf-8').trim();
    } else {
        // Create the branch file if it doesn't exist
        fs.writeFileSync(branchPath, '');
    }

    const author = 'John Crickett <3667898+JohnCrickett@users.noreply.github.com>';
    const date = new Date().toISOString();

    let commitContent = `tree ${treeHash}\n`;
    if (parentHash) {
        commitContent += `parent ${parentHash}\n`;
    }
    commitContent += `author ${author} ${Math.floor(Date.now() / 1000)} +0000\n`;
    commitContent += `committer ${author} ${Math.floor(Date.now() / 1000)} +0000\n\n`;
    commitContent += `${message}\n`;

    const commitHash = writeObject('commit', Buffer.from(commitContent));
    fs.writeFileSync(branchPath, commitHash);

    console.log(`Committed to master: ${commitHash}`);
}




// Show the status of the repository
function status(repoPath: string): void {
    const indexPath = path.join(repoPath, GIT_DIR, 'index');
    const indexEntries = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf-8').split('\n').filter(Boolean) : [];

    const trackedFiles = new Set(indexEntries.map(entry => entry.split(' ')[1]));
    const currentFiles = new Set(fs.readdirSync(repoPath).filter(file => file !== GIT_DIR));

    console.log('On branch master\n');

    console.log('Changes to be committed:');
    for (const entry of indexEntries) {
        const [fileHash, relativeFilePath] = entry.split(' ');
        const absoluteFilePath = path.join(repoPath, relativeFilePath);
        if (fs.existsSync(absoluteFilePath)) {
            const fileContent = fs.readFileSync(absoluteFilePath);
            const currentHash = crypto.createHash('sha1').update(`blob ${fileContent.length}\0${fileContent}`).digest('hex');
            if (currentHash === fileHash) {
                console.log(`\tfile:   ${relativeFilePath}`);
            }
        }
    }

    console.log('\nUntracked files:');
    for (const file of currentFiles) {
        if (!trackedFiles.has(file)) {
            console.log(`\t${file}`);
        }
    }
}




// Main CLI entry point
const [command, ...args] = process.argv.slice(2);
const repoPath = process.cwd();

switch (command) {
    case 'init':
        if (args.length === 0) {
            console.error('Please specify the directory to initialize.');
        } else {
            init(path.join(repoPath, args[0]));
        }
        break;
    case 'add':
        if (args.length === 0) {
            console.error('Please specify files to add.');
        } else {
            args.forEach(filePath => add(repoPath, path.join(repoPath, filePath)));
        }
        break;
    case 'commit':
        if (args.length === 0) {
            console.error('Please provide a commit message.');
        } else {
            commit(repoPath, args.join(' '));
        }
        break;
    case 'status':
        status(repoPath);
        break;
    default:
        console.log(`Unknown command: ${command}`);
}
