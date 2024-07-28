const { DOMParser, XMLSerializer } = require("xmldom");

// function SortTopicsTags(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const topics = body.getElementsByTagName("topic");

//   for (let i = 0; i < topics.length; i++) {
//     const title = topics[i].getElementsByTagName("title")[0];
//     if (title) {
//       const outputclass = title.getAttribute("outputclass");
//       if (outputclass === "h1") {
//         let currentTopic = topics[i];
//         let nextSibling = currentTopic.nextSibling;
//         let subTopics = [];

//         // Iterate through subsequent siblings
//         while (nextSibling && nextSibling.nodeName === "topic") {
//           const subTitle = nextSibling.getElementsByTagName("title")[0];
//           if (subTitle) {
//             const subOutputclass = subTitle.getAttribute("outputclass");
//             if (
//               subOutputclass === "h2" ||
//               subOutputclass === "h3" ||
//               subOutputclass === "h4" ||
//               subOutputclass === "h5" ||
//               subOutputclass === "h6"
//             ) {
//               // Move the whole topic block to the subTopics array
//               subTopics.push(nextSibling);
//               // Move to the next sibling
//               nextSibling = nextSibling.nextSibling;
//             } else {
//               break; // Break the loop if the title is not h3, h4, h5, or h6
//             }
//           } else {
//             break; // Break the loop if the next sibling doesn't have a title
//           }
//         }

//         if (subTopics.length > 0) {
//           const h2Topic = topics[i];
//           for (const subTopic of subTopics) {
//             h2Topic.appendChild(subTopic);
//           }
//         }
//       } else if (outputclass === "h2") {
//         let currentTopic = topics[i];
//         let nextSibling = currentTopic.nextSibling;
//         let subTopics = [];

//         // Iterate through subsequent siblings
//         while (nextSibling && nextSibling.nodeName === "topic") {
//           const subTitle = nextSibling.getElementsByTagName("title")[0];
//           if (subTitle) {
//             const subOutputclass = subTitle.getAttribute("outputclass");
//             if (
//               subOutputclass === "h3" ||
//               subOutputclass === "h4" ||
//               subOutputclass === "h5" ||
//               subOutputclass === "h6"
//             ) {
//               // Move the whole topic block to the subTopics array
//               subTopics.push(nextSibling);
//               // Move to the next sibling
//               nextSibling = nextSibling.nextSibling;
//             } else {
//               break; // Break the loop if the title is not h4, h5, or h6
//             }
//           } else {
//             break; // Break the loop if the next sibling doesn't have a title
//           }
//         }

//         if (subTopics.length > 0) {
//           const h3Topic = topics[i];
//           for (const subTopic of subTopics) {
//             h3Topic.appendChild(subTopic);
//           }
//         }
//       } else if (outputclass === "h3") {
//         let currentTopic = topics[i];
//         let nextSibling = currentTopic.nextSibling;
//         let subTopics = [];

//         // Iterate through subsequent siblings
//         while (nextSibling && nextSibling.nodeName === "topic") {
//           const subTitle = nextSibling.getElementsByTagName("title")[0];
//           if (subTitle) {
//             const subOutputclass = subTitle.getAttribute("outputclass");
//             if (
//               subOutputclass === "h4" ||
//               subOutputclass === "h5" ||
//               subOutputclass === "h6"
//             ) {
//               // Move the whole topic block to the subTopics array
//               subTopics.push(nextSibling);
//               // Move to the next sibling
//               nextSibling = nextSibling.nextSibling;
//             } else {
//               break; // Break the loop if the title is not h5 or h6
//             }
//           } else {
//             break; // Break the loop if the next sibling doesn't have a title
//           }
//         }

//         if (subTopics.length > 0) {
//           const h4Topic = topics[i];
//           for (const subTopic of subTopics) {
//             h4Topic.appendChild(subTopic);
//           }
//         }
//       } else if (outputclass === "h4") {
//         let currentTopic = topics[i];
//         let nextSibling = currentTopic.nextSibling;
//         let subTopics = [];

//         // Iterate through subsequent siblings
//         while (nextSibling && nextSibling.nodeName === "topic") {
//           const subTitle = nextSibling.getElementsByTagName("title")[0];
//           if (subTitle) {
//             const subOutputclass = subTitle.getAttribute("outputclass");
//             if (subOutputclass === "h5" || subOutputclass === "h6") {
//               // Move the whole topic block to the subTopics array
//               subTopics.push(nextSibling);
//               // Move to the next sibling
//               nextSibling = nextSibling.nextSibling;
//             } else {
//               break; // Break the loop if the title is not h6
//             }
//           } else {
//             break; // Break the loop if the next sibling doesn't have a title
//           }
//         }

//         if (subTopics.length > 0) {
//           const h5Topic = topics[i];
//           for (const subTopic of subTopics) {
//             h5Topic.appendChild(subTopic);
//           }
//         }
//       } else if (outputclass === "h5") {
//         let currentTopic = topics[i];
//         let nextSibling = currentTopic.nextSibling;
//         let subTopics = [];

//         // Iterate through subsequent siblings
//         while (nextSibling && nextSibling.nodeName === "topic") {
//           const subTitle = nextSibling.getElementsByTagName("title")[0];
//           if (subTitle) {
//             const subOutputclass = subTitle.getAttribute("outputclass");
//             if (subOutputclass === "h6") {
//               // Move the whole topic block to the subTopics array
//               subTopics.push(nextSibling);
//               // Move to the next sibling
//               nextSibling = nextSibling.nextSibling;
//             } else {
//               break; // Break the loop if the title is not h6
//             }
//           } else {
//             break; // Break the loop if the next sibling doesn't have a title
//           }
//         }

//         if (subTopics.length > 0) {
//           const h5Topic = topics[i];
//           for (const subTopic of subTopics) {
//             h5Topic.appendChild(subTopic);
//           }
//         }
//       }
//     }
//   }

//   const serializer = new XMLSerializer();
//   const modifiedXmlString = serializer.serializeToString(xmlDoc);

//   return modifiedXmlString;
// }

function SortTopicsTags(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const body = xmlDoc.getElementsByTagName("body")[0];
  const topics = body.getElementsByTagName("topic");

  for (let i = 0; i < topics.length; i++) {
    const title = topics[i].getElementsByTagName("title")[0];
    if (title) {
      const outputclass = title.getAttribute("outputclass");
      if (outputclass === "h1") {
        let currentTopic = topics[i];
        let nextSibling = currentTopic.nextSibling;
        let subTopics = [];

        // Iterate through subsequent siblings
        while (nextSibling && nextSibling.nodeName === "topic") {
          const subTitle = nextSibling.getElementsByTagName("title")[0];
          if (subTitle) {
            const subOutputclass = subTitle.getAttribute("outputclass");
            if (
              subOutputclass === "h2" ||
              subOutputclass === "h3" ||
              subOutputclass === "h4" ||
              subOutputclass === "h5" ||
              subOutputclass === "h6"
            ) {
              // Move the whole topic block to the subTopics array
              subTopics.push(nextSibling);
            } else {
              break; // Break the loop if the title is not h2, h3, h4, h5, or h6
            }
          } else {
            break; // Break the loop if the next sibling doesn't have a title
          }
          // Move to the next sibling
          nextSibling = nextSibling.nextSibling;
        }

        if (subTopics.length > 0) {
          const h1Topic = topics[i];
          for (const subTopic of subTopics) {
            h1Topic.appendChild(subTopic);
          }
        }
      } else if (
        outputclass === "h2" ||
        outputclass === "h3" ||
        outputclass === "h4" ||
        outputclass === "h5" ||
        outputclass === "h6"
      ) {
        let currentTopic = topics[i];
        let nextSibling = currentTopic.nextSibling;
        let subTopics = [];

        // Iterate through subsequent siblings
        while (nextSibling && nextSibling.nodeName === "topic") {
          const subTitle = nextSibling.getElementsByTagName("title")[0];
          if (subTitle) {
            const subOutputclass = subTitle.getAttribute("outputclass");
            if (
              (outputclass === "h2" && subOutputclass === "h3") ||
              (outputclass === "h3" &&
                (subOutputclass === "h4" ||
                  subOutputclass === "h5" ||
                  subOutputclass === "h6")) ||
              (outputclass === "h4" &&
                (subOutputclass === "h5" || subOutputclass === "h6")) ||
              (outputclass === "h5" && subOutputclass === "h6")
            ) {
              // Move the whole topic block to the subTopics array
              subTopics.push(nextSibling);
            } else {
              break; // Break the loop if the title is not the expected heading level
            }
          } else {
            break; // Break the loop if the next sibling doesn't have a title
          }
          // Move to the next sibling
          nextSibling = nextSibling.nextSibling;
        }

        if (subTopics.length > 0) {
          const currentTopic = topics[i];
          for (const subTopic of subTopics) {
            currentTopic.appendChild(subTopic);
          }
        }
      }
    }
  }

  const serializer = new XMLSerializer();
  const modifiedXmlString = serializer.serializeToString(xmlDoc);

  return modifiedXmlString;
}

module.exports = SortTopicsTags;
