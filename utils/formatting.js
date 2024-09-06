// Convert Value to Currency
function convertUsdToCurrency(amountInUsd, valueToConvert) {
  return amountInUsd * valueToConvert;
}

// Format the currency
function formatCurrency(value) {
  return parseFloat(value)
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Format relative time
function formatDateWithRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const diffInMs = now - date;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  let relativeTime = "";

  if (diffInDays < 1) {
    relativeTime = "today";
  } else if (diffInDays < 30) {
    const days = Math.floor(diffInDays);
    relativeTime = `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    relativeTime = `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    relativeTime = `${years} year${years > 1 ? "s" : ""} ago`;
  }

  return `${formattedDate} (${relativeTime})`;
}

// Convert line breaks to paragraphs
function formatDescription(description) {
  return description
    .split(/\r?\n\n/) // Split text by double new lines for paragraphs
    .filter((paragraph) => paragraph.trim() !== "") // Remove empty paragraphs
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`) // each  paragraph be wrapped in <p> tags and replace single new lines with <br> tags
    .join(""); // Join all the <p> tags into a single string
}

function formatLargeNumber(num) {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + "T"; // Trillions
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B"; // Billions
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M"; // Millions
  } else {
    return num.toLocaleString();
  }
}

module.exports = {
  convertUsdToCurrency,
  formatCurrency,
  formatDateWithRelativeTime,
  formatDescription,
  formatLargeNumber,
};
