// get content only which is inside html root element remove !Doctype in html
function extractHTML(htmlString) {
  // Find the start and end positions of the <html> tags
  const startIndex = htmlString.indexOf("<html");
  const endIndex = htmlString.lastIndexOf("</html>") + "</html>".length;
  // Extract the content between <html> tags
  const extractedHTML = htmlString.substring(startIndex, endIndex);
  return extractedHTML;
}

module.exports = extractHTML;
