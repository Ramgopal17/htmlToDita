const fs = require("fs").promises;

// Function to check if a directory exists
async function isValidDirectory(folderPath) {
  try {
    await fs.access(folderPath);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = isValidDirectory;
