const { v4: uuidv4 } = require("uuid");

// Function to generate a random ID
function generateRandomId(length) {
  // Generate a UUID
  const uuid = uuidv4();
  // Remove any hyphens and take the first 6 characters
  const sixDigitId = uuid.replace(/-/g, "").substring(0, length);
  return sixDigitId;
}

module.exports = generateRandomId;
