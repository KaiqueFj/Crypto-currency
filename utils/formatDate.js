module.exports = function formatDateWithRelativeTime(dateString) {
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
};