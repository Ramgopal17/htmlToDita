// Function to validate a URL
function validateURL(url) {
  // Regular expression for URL validation
  var regex = /^(https?|ftp)?:\/\/[^\s\/$.?#].[^\s]*$/;

  // Test the URL against the regex
  var isValid = regex.test(url);

  // If the URL didn't match and there's no protocol specified, try matching without it
  if (!isValid && !url?.includes("://")) {
    regex = /^[^\s\/$.?#].[^\s]*$/; // Updated regex without protocol
    isValid = regex.test(url);
  }

  // Return true if the URL is valid, false otherwise
  return isValid;
}

module.exports = validateURL;
