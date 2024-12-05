const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');

// Create a new Audio object and set the path to your tick sound file
const tickSound = new Audio('./tick.m4a'); // Adjust the path to your sound file

// Function to update the clock and play the tick sound
function updateClock() {
  const now = new Date();

  const hours = now.getHours() % 12; // 12-hour format
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourDeg = (360 / 12) * hours + (30 / 60) * minutes; // 360 degrees divided by 12 hours
  const minuteDeg = (360 / 60) * minutes + (6 / 60) * seconds;
  const secondDeg = (360 / 60) * seconds;

  hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;

  // Play the tick sound every second
  tickSound.play();
}

// Set interval to update clock every second
window.onload = function() {
  setInterval(updateClock, 1000);  // Start clock on page load
};

// Play the tick sound when the button is clicked
const soundButton = document.getElementById('soundButton');
soundButton.addEventListener('click', function() {
  tickSound.play();  // Play the tick sound on button click
});
