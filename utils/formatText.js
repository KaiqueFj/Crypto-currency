// Convert line breaks to paragraphs
module.exports = function formatDescription(description) {
  return description
    .split(/\r?\n\n/) // Split text by double new lines for paragraphs
    .filter((paragraph) => paragraph.trim() !== "") // Remove empty paragraphs
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`) // each  paragraph be wrapped in <p> tags and replace single new lines with <br> tags
    .join(""); // Join all the <p> tags into a single string
};
