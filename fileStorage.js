// fileStorage.js

const CODER_FILES_KEY = 'coder_files';

export const fileStorage = {
    // Get all files from storage
    getFiles: function() {
        const files = localStorage.getItem(CODER_FILES_KEY);
        return files ? JSON.parse(files) : {};
    },

    // Save all files to storage
    saveFiles: function(files) {
        localStorage.setItem(CODER_FILES_KEY, JSON.stringify(files));
    },

    // Get a specific file content
    getFile: function(filePath) {
        const files = this.getFiles();
        return files[filePath] || null;
    },

    // Save a specific file content
    saveFile: function(filePath, content) {
        const files = this.getFiles();
        files[filePath] = content;
        this.saveFiles(files);
    },

    // Delete a file
    deleteFile: function(filePath) {
        const files = this.getFiles();
        if (files[filePath] !== undefined) { // Check existence more reliably
            delete files[filePath];
            this.saveFiles(files);
            return true;
        }
        return false;
    },

    // Rename a file
    renameFile: function(oldPath, newPath) {
        const files = this.getFiles();
        if (files[oldPath] !== undefined && files[newPath] === undefined) { // Ensure old exists and new doesn't
            files[newPath] = files[oldPath];
            delete files[oldPath];
            this.saveFiles(files);
            return true;
        }
        return false;
    }
};

// Default file content
const defaultIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coder</title>
    <link rel="stylesheet" href="styles.css">
    <script type="module" src="main.js" defer></script>
</head>
<body>
    <h1>Welcome to Coder!</h1>
</body>
</html>`;

const defaultStylesCSS = `body {
    font-family: sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}

h1 {
    color: #333;
}`;

const defaultMainJS = `// Coder entry point

console.log("Coder initialized.");
`;

// Load files from storage or create default files if none exist
export function initializeFiles() {
    let files = fileStorage.getFiles(); // Use 'let' to allow modification
    let filesCreated = false;

    const defaultFiles = {
        'index.html': defaultIndexHTML,
        'styles.css': defaultStylesCSS,
        'main.js': defaultMainJS
    };

    // Check and create default files if they don't exist in storage
    for (const [path, content] of Object.entries(defaultFiles)) {
        if (files[path] === undefined) {
             console.log(`Default file '${path}' not found in storage. Creating...`);
             files[path] = content; // Add to the object first
             filesCreated = true;
        }
    }

    // If any default files were added, save the updated collection back to storage
    if (filesCreated) {
        console.log("Saving newly created default files to storage.");
        fileStorage.saveFiles(files);
    }

    // Return the potentially updated files object
    return files;
} 