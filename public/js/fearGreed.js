// Function to update the speedometer needle
function updateSpeedDoMeter(value) {
  const maxValue = 100;
  const angle = (value / maxValue) * 180 - 90;

  const needle = document.querySelector(".speedometer-needle");
  if (needle) {
    needle.style.transform = "";
    needle.style.transform = `rotate(${angle}deg)`;
  }
}

module.exports = updateSpeedDoMeter;
