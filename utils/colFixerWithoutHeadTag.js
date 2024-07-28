// const { DOMParser, XMLSerializer } = require("xmldom");

// function colFixerWithoutHeadTag(xmlString) {
//   const parser = new DOMParser();
//   const dom = parser.parseFromString(xmlString, "text/xml");

//   const tables = dom.getElementsByTagName("table");

//   for (let i = 0; i < tables.length; i++) {
//     const table = tables[i];
//     const tgroup = table.getElementsByTagName("tgroup")[0];

//     if (tgroup) {
//       let colCount = tgroup.getAttribute("cols");
//       if (colCount === "0") {
//         let entryCount = 0;

//         // Check if the table has thead
//         const thead = tgroup.getElementsByTagName("thead")[0];

//         console.log("colCount --->", thead.textContent);
//         if (thead) {
//           const row = thead.getElementsByTagName("row")[0];
//           if (row) {
//             entryCount = row.getElementsByTagName("entry").length;
//           }
//         } else {
//           // If no <thead>, check for tbody
//           const tbody = tgroup.getElementsByTagName("tbody")[0];
//           if (tbody) {
//             const rows = tbody.getElementsByTagName("row");
//             if (rows.length > 0) {
//               const row = rows[0];
//               entryCount = row.getElementsByTagName("entry").length;
//             }
//           }
//         }

//         // Update the cols attribute value
//         tgroup.setAttribute("cols", entryCount);
//       }
//     }
//   }

//   const serializer = new XMLSerializer();
//   return serializer.serializeToString(dom);
// }

// module.exports = colFixerWithoutHeadTag;

const { DOMParser, XMLSerializer } = require("xmldom");

function colFixerWithoutHeadTag(xmlString) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(xmlString, "text/xml");

  const tables = dom.getElementsByTagName("table");

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const tgroup = table.getElementsByTagName("tgroup")[0];

    if (tgroup) {
      let colCount = tgroup.getAttribute("cols");
      if (colCount === "0") {
        let entryCount = 0;

        const thead = Array.from(tgroup.childNodes).find(
          (node) => node.nodeName === "thead"
        );

        if (thead) {
          const row = thead.getElementsByTagName("row")[0];
          if (row) {
            entryCount = row.getElementsByTagName("entry").length;
          }
        } else {
          const tbody = Array.from(tgroup.childNodes).find(
            (node) => node.nodeName === "tbody"
          );
          if (tbody) {
            const rows = tbody.getElementsByTagName("row");
            if (rows.length > 0) {
              const row = rows[0];
              entryCount = row.getElementsByTagName("entry").length;
            }
          }
        }

        tgroup.setAttribute("cols", entryCount);
      }
    }
  }

  const serializer = new XMLSerializer();
  return serializer.serializeToString(dom);
}

module.exports = colFixerWithoutHeadTag;
