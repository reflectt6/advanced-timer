let phases = [];
let currentPhase = 0;
let timeLeft = 0;
let interval = null;
const timerEl = document.getElementById("timer");
const phaseEl = document.getElementById("phase");
let beepAudio = null;
let started = 0;

function playBeep() {
  if (!beepAudio) {
    beepAudio = new Audio("beep.mp3");
  } else {
    beepAudio.currentTime = 0;
  }
  beepAudio.play().catch(() => { });
}

function buildPhases(config) {
  const result = [];
  result.push({ label: "热身", duration: config.warmup });
  for (let i = 0; i < config.rounds; i++) {
    result.push({ label: `训练 ${i + 1}`, duration: config.work });
    result.push({ label: `休息 ${i + 1}`, duration: config.rest }); // 包含最后一组的休息
  }
  result.push({ label: "放松", duration: config.cooldown });
  return result;
}

function updateDisplay() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  timerEl.textContent = `${mins}:${secs}`;
}

function tick() {
  if (timeLeft <= 0) {
    currentPhase++;
    if (currentPhase >= phases.length) {
      clearInterval(interval);
      phaseEl.textContent = "完成！";
      return;
    }
    startPhase();
  } else {
    if (timeLeft == 2) playBeep();
    timeLeft--;
    updateDisplay();
  }
}

function startPhase() {
  const phase = phases[currentPhase];
  phaseEl.textContent = phase.label;
  timeLeft = phase.duration;
  updateDisplay();
}

function startTimer() {
  if (interval) {
    clearInterval(interval);
    started = 0;
  }
  if (started == 0) {
    beepAudio = new Audio("beep.mp3"); // 激活音频权限
    const config = {
      warmup: parseInt(document.getElementById("warmup").value),
      work: parseInt(document.getElementById("work").value),
      rest: parseInt(document.getElementById("rest").value),
      rounds: parseInt(document.getElementById("rounds").value),
      cooldown: parseInt(document.getElementById("cooldown").value),
    };

    phases = buildPhases(config);
    currentPhase = 0;
    started = 1;
    startPhase();
  }
  interval = setInterval(tick, 1000);
}

function stop() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  stop();
  started = 0;
  phases = [];
  currentPhase = 0;
  timeLeft = 0;
  interval = null;
  phaseEl.textContent = "凯格尔训练";
  updateDisplay();
}