const timeDisplay = document.getElementById('timeDisplay');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const presets = document.querySelectorAll('.preset');
const customMinutes = document.getElementById('customMinutes');
const setCustom = document.getElementById('setCustom');
const progressEl = document.getElementById('progress');
const modal = document.getElementById('motivationModal');
const closeModal = document.getElementById('closeModal');
const closeBtn = document.getElementById('closeBtn');
const copyBtn = document.getElementById('copyBtn');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const motivQuoteEl = document.getElementById('motivQuote');
const motivAuthorEl = document.getElementById('motivAuthor');
const motivEmoji = document.getElementById('motivEmoji');

let defaultMinutes = 25;
let remainingSeconds = defaultMinutes * 60;
let totalSeconds = remainingSeconds;
let timerInterval = null;
let isRunning = false;
let lastMotivationTime = 0; 

const offlineQuotes = [
  { q: "You did it! Keep going 🌟", a: "" },
  { q: "Small steps every day lead to big results 💪", a: "" },
  { q: "Focus on the process, not the outcome 🧠", a: "" },
  { q: "Take a deep breath — you’ve earned it 🌿", a: "" },
  { q: "Progress, not perfection 🚀", a: "" }
];

function setDisplayFromSeconds(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  minutesEl.textContent = String(m).padStart(2, '0');
  secondsEl.textContent = String(s).padStart(2, '0');
}

function setPresetActive(min) {
  presets.forEach(btn => btn.classList.toggle('active', Number(btn.dataset.min) === Number(min)));
}

function setTimerMinutes(min) {
  defaultMinutes = Number(min);
  remainingSeconds = defaultMinutes * 60;
  totalSeconds = remainingSeconds;
  setDisplayFromSeconds(remainingSeconds);
  setPresetActive(min);
  updateProgress();
}

function updateProgress() {
  const pct = totalSeconds === 0 ? 0 : ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  progressEl.style.width = pct + '%';
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  startBtn.textContent = 'Running...';
  lastMotivationTime = remainingSeconds;

  timerInterval = setInterval(async () => {
    remainingSeconds--;
    setDisplayFromSeconds(remainingSeconds);
    updateProgress();
    await periodicMotivation();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      startBtn.textContent = 'Start';
      remainingSeconds = 0;
      setDisplayFromSeconds(0);
      updateProgress();
      onSessionEnd();
    }
  }, 1000);
}
async function periodicMotivation() {
  const secondsPassed = totalSeconds - remainingSeconds;
  if (secondsPassed !== 0 && secondsPassed % 600 === 0) { 
    const quote = await fetchZenQuote();
    motivEmoji.textContent = randomEmoji();
    motivQuoteEl.textContent = `"${quote.q}"`;
    motivAuthorEl.textContent = quote.a ? `— ${quote.a}` : '';
  }
}

function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  startBtn.textContent = 'Start';
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  startBtn.textContent = 'Start';
  remainingSeconds = defaultMinutes * 60;
  totalSeconds = remainingSeconds;
  setDisplayFromSeconds(remainingSeconds);
  updateProgress();
}

presets.forEach(btn => {
  btn.addEventListener('click', () => {
    const min = Number(btn.dataset.min);
    setTimerMinutes(min);
    resetTimer();
  });
});

setCustom.addEventListener('click', () => {
  const val = Number(customMinutes.value);
  if (!val || val <= 0 || val > 180) {
    alert('Enter a custom length between 1 and 180 minutes');
    return;
  }
  setTimerMinutes(val);
  resetTimer();
  customMinutes.value = '';
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

async function fetchZenQuote() {
  try {
    const res = await fetch('https://zenquotes.io/api/random', { cache: "no-store" });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (Array.isArray(data) && data[0] && data[0].q) {
      return { q: data[0].q, a: data[0].a || '' };
    }
    throw new Error('Unexpected response');
  } catch (e) {
    const pick = offlineQuotes[Math.floor(Math.random() * offlineQuotes.length)];
    return pick;
  }
}

function randomEmoji() {
  const arr = ['🌟', '🔥', '🌿', '💪', '✨', '🌈', '🍀', '🌞', '🤝', '🚀'];
  return arr[Math.floor(Math.random() * arr.length)];
}

async function onSessionEnd() {
  motivEmoji.textContent = randomEmoji();
  motivQuoteEl.textContent = 'Fetching inspirational quote...';
  motivAuthorEl.textContent = '';
  showModal(true);

  const quote = await fetchZenQuote();
  motivQuoteEl.textContent = `"${quote.q}"`;
  motivAuthorEl.textContent = quote.a ? `— ${quote.a}` : '';
}

function showModal(open = true) {
  modal.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (open) {
    modal.querySelector('.modal-panel').animate(
      [
        { transform: 'translateY(10px) scale(0.98)', opacity: 0 },
        { transform: 'translateY(0) scale(1)', opacity: 1 }
      ],
      { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
  }
}
closeModal.addEventListener('click', () => showModal(false));
closeBtn.addEventListener('click', () => showModal(false));

copyBtn.addEventListener('click', () => {
  const text = `${motivQuoteEl.textContent} ${motivAuthorEl.textContent}`.trim();
  navigator.clipboard?.writeText(text).then(() => {
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy Quote'), 1400);
  }).catch(() => alert('Copy failed'));
});

newQuoteBtn.addEventListener('click', async () => {
  motivQuoteEl.textContent = 'Fetching inspirational quote...';
  motivAuthorEl.textContent = '';
  const quote = await fetchZenQuote();
  motivQuoteEl.textContent = `"${quote.q}"`;
  motivAuthorEl.textContent = quote.a ? `— ${quote.a}` : '';
});

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && document.activeElement === startBtn) {
    e.preventDefault();
    startTimer();
  }
  if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') showModal(false);
});
setDisplayFromSeconds(remainingSeconds);
updateProgress();
