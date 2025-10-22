const form = document.getElementById('footprintForm');
const resultDiv = document.getElementById('result');
const bar = document.getElementById('bar');
const valueText = document.getElementById('value');
const tipText = document.getElementById('tip');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const driving = parseFloat(document.getElementById('driving').value) || 0;
  const meals = parseFloat(document.getElementById('meals').value) || 0;
  const electricity = parseFloat(document.getElementById('electricity').value) || 0;

  // Simple formula (approximate)
  const total = (driving * 0.12) + (meals * 2.5) + (electricity * 0.3);

  resultDiv.classList.remove('hidden');
  valueText.textContent = `Your footprint: ${total.toFixed(2)} kg CO₂/day`;

  // Update bar
  const percentage = Math.min(total * 4, 100);
  bar.style.width = percentage + '%';

  // Suggestion tips
  let tip = "";
  if (total < 3) {
    tip = "🌱 Excellent! You're living very sustainably.";
  } else if (total < 6) {
    tip = "💡 Good job! Try reducing car use or meat consumption.";
  } else {
    tip = "🔥 High footprint! Try carpooling, eating more veggies, and using renewable energy.";
  }
  tipText.textContent = tip;
});
