const fs = require("fs");
const xmlFormat = require("xml-formatter");
const { resetDataRoot } = require("../state/rootDita");

function rootDitaMaker(data, outputFolderPath) {
  let xmlString = "";
  data.forEach((item) => {
    let path = item.DitaMapPath.split("/")
      .filter((s) => s !== ".")
      .slice(1)
      .join("/");
    xmlString += `<mapref href="${path}"/>\n`;
  });

  const mainString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">
<map>\n${xmlString}</map>`;

  fs.writeFileSync(
    `${outputFolderPath}/main.ditamap`,
    xmlFormat(mainString, {
      indentation: "  ",
      filter: (node) => node.type !== "Comment",
      collapseContent: true,
      lineSeparator: "\n",
    })
  );

  console.log("Root Dita map created successfully.");
  resetDataRoot();
}

module.exports = rootDitaMaker;
