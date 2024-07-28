const fs = require("fs");
const path = require("path");

// Function to create directory recursively
function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    createDirectory(path.dirname(directory)); // Recursively create parent directories
    fs.mkdirSync(directory); // Create the directory
  }
}

module.exports = createDirectory;
