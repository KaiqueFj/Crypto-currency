const { needle } = require('../handleElements/handleElements');

function updateSpeedDoMeter(value) {
  const maxValue = 100;
  const angle = (value / maxValue) * 180 - 90; // Calculate the angle correctly

  if (needle) {
    needle.style.transform = `rotate(${angle}deg)`;
  }
}

module.exports = updateSpeedDoMeter;
