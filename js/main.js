import { NumberGame, STATES } from "./game.js";
import { animateFeedback, buildWave } from "./animations.js";

const $ = (selector) => document.querySelector(selector);
const game = new NumberGame();
const input = $("#guess");
const form = $("#guess-form");
const resultDialog = $("#result-dialog");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let scene = null;
let processing = false;
let visibleNumber = "00";
let visualOutcome = STATES.READY;
let lastSubmission = -Infinity;
let preferences = { motion: true, intensity: 35 };
// Storage can be blocked in private browsing; the game still works with defaults.
try {
  const saved = JSON.parse(localStorage.getItem("numo-preferences") || "{}");
  if (typeof saved.motion === "boolean") preferences.motion = saved.motion;
  if (Number.isFinite(saved.intensity))
    preferences.intensity = Math.min(100, Math.max(0, saved.intensity));
} catch {
  /* Optional preferences must never prevent play. */
}
const motionEnabled = () => preferences.motion && !reducedMotion.matches;
function announce(message) {
  $("#announcements").textContent = message;
}
function savePreferences() {
  try {
    localStorage.setItem("numo-preferences", JSON.stringify(preferences));
  } catch {
    /* Nonessential storage. */
  }
}
function applyPreferences() {
  const enabled = motionEnabled();
  document.body.classList.toggle("motion-paused", !enabled);
  $("#motion-setting").checked = enabled;
  $("#motion-setting").disabled = reducedMotion.matches;
  $("#motion-toggle").disabled = reducedMotion.matches;
  $("#motion-toggle").setAttribute("aria-pressed", String(!enabled));
  $("#motion-label").textContent = enabled ? "PAUSE MOTION" : "MOTION PAUSED";
  if (!enabled && !reducedMotion.matches)
    $("#motion-label").textContent = "RESUME MOTION";
  $("#motion-icon").textContent = enabled ? "Ⅱ" : "▷";
  $("#system-motion-note").textContent = reducedMotion.matches
    ? "Your system’s reduced-motion preference is active. Decorative motion is disabled."
    : "Your preferences are saved on this device.";
  $("#intensity").value = preferences.intensity;
  $("#intensity-value").textContent = `${preferences.intensity}%`;
  scene?.setMotion(enabled);
  scene?.setIntensity(preferences.intensity / 100);
}
function setVisibleNumber(number, outcome) {
  visibleNumber = String(number).padStart(2, "0");
  visualOutcome = outcome;
  $("#number-fallback").textContent = visibleNumber;
  $("#accessible-number").textContent =
    visibleNumber === "00"
      ? "No guesses yet."
      : `Displayed number: ${Number(visibleNumber)}.`;
  scene?.setNumber(visibleNumber, outcome);
}
function updateHistory() {
  const list = $("#guess-history");
  list.replaceChildren();
  for (let i = 0; i < 5; i++) {
    const guess = game.history[i];
    const item = document.createElement("li");
    item.classList.toggle("filled", Boolean(guess));
    item.classList.toggle(
      "current",
      !game.isFinished && i === game.history.length,
    );
    const slot = document.createElement("span");
    slot.className = "slot-number";
    slot.textContent = `MOVE 0${i + 1}`;
    const value = document.createElement("span");
    value.className = "guess-value";
    value.textContent = guess ? String(guess.number).padStart(2, "0") : "—";
    const direction = document.createElement("span");
    direction.className = "guess-direction";
    direction.textContent = guess
      ? { low: "↑ TOO LOW", high: "↓ TOO HIGH", correct: "✓ CORRECT" }[
          guess.direction
        ]
      : i === game.history.length && !game.isFinished
        ? "YOUR MOVE"
        : "—";
    item.append(slot, value, direction);
    list.append(item);
  }
  $("#attempt-count").replaceChildren(
    document.createTextNode(String(game.remaining).padStart(2, "0") + " "),
  );
  const total = document.createElement("span");
  total.textContent = "/ 05";
  $("#attempt-count").append(total);
  $("#attempt-dots")
    .querySelectorAll("span")
    .forEach((dot, i) => dot.classList.toggle("used", i < game.history.length));
}
function setFeedback(title, detail, symbol) {
  $("#feedback-title").textContent = title;
  $("#feedback-detail").textContent = detail;
  $("#feedback-symbol").textContent = symbol;
  animateFeedback($(".feedback"), motionEnabled());
}
function resetRound() {
  game.reset();
  processing = false;
  lastSubmission = -Infinity;
  input.disabled = false;
  $("#submit-guess").disabled = false;
  input.value = "";
  input.removeAttribute("aria-invalid");
  $("#input-error").textContent = "";
  delete document.body.dataset.outcome;
  $("#scene-label").textContent = "THE UNKNOWN";
  $("#scene-status").textContent = "AWAITING YOUR FIRST MOVE";
  setVisibleNumber("00", STATES.READY);
  updateHistory();
  setFeedback("MAKE A GUESS", "Every guess brings you closer.", "↗");
}
function showResult(result) {
  const won = result.state === STATES.WON;
  document.body.dataset.outcome = result.state;
  input.disabled = true;
  $("#submit-guess").disabled = true;
  $("#result-number").textContent = String(result.revealedNumber).padStart(
    2,
    "0",
  );
  $("#result-title").textContent = won ? "YOU FOUND IT." : "MYSTERY SOLVED.";
  $("#result-eyebrow").textContent = won
    ? "YOU WIN — EXPERIMENT COMPLETE"
    : "GAME OVER — NUMBER REVEALED";
  $("#result-description").textContent = won
    ? `The number was ${result.revealedNumber}. You found it in ${result.history.length} ${result.history.length === 1 ? "guess" : "guesses"}. Beautifully played.`
    : `The number was ${result.revealedNumber}. Five moves, a little more insight. A fresh possibility is waiting.`;
  resultDialog.classList.toggle("lost", !won);
  setVisibleNumber(result.revealedNumber, result.state);
  $("#scene-label").textContent = "THE REVEAL";
  $("#scene-status").textContent = won
    ? "CORRECT — YOU FOUND IT"
    : "ALL FIVE MOVES COMPLETE";
  resultDialog.showModal();
  resultDialog.querySelector(".solid-button").focus();
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (processing || game.isFinished) return;
  // A short input guard stops double taps; it is independent of animation completion.
  const now = performance.now();
  if (now - lastSubmission < 180) return;
  processing = true;
  const result = game.submit(input.value);
  if (!result.ok) {
    $("#input-error").textContent = result.error;
    input.setAttribute("aria-invalid", "true");
    announce(result.error);
    input.focus();
    processing = false;
    return;
  }
  lastSubmission = now;
  input.removeAttribute("aria-invalid");
  $("#input-error").textContent = "";
  input.value = "";
  updateHistory();
  setVisibleNumber(result.number, result.direction);
  $("#scene-label").textContent = "YOUR LAST GUESS";
  $("#scene-status").textContent = `MOVE 0${result.history.length} RECORDED`;
  const feedback =
    result.direction === "low"
      ? ["TOO LOW", "Look higher. You’re narrowing it down.", "↑"]
      : result.direction === "high"
        ? ["TOO HIGH", "Look lower. Follow the possibilities.", "↓"]
        : ["CORRECT", "That’s the one. Beautifully played.", "✓"];
  setFeedback(...feedback);
  announce(
    `${result.number}: ${feedback[0]}. ${result.remaining} attempts remaining.`,
  );
  animateFeedback($("#attempt-count"), motionEnabled());
  if (game.isFinished) showResult(result);
  else input.focus({ preventScroll: true });
  processing = false;
});
input.addEventListener("input", () => {
  input.removeAttribute("aria-invalid");
  $("#input-error").textContent = "";
});
// Closing by Escape, the X, or Play Again all use the same reset path.
resultDialog.addEventListener("close", () => {
  resetRound();
  announce("New game. Five attempts remaining.");
  if (matchMedia("(pointer:fine)").matches)
    input.focus({ preventScroll: true });
  else $("#game-nav").focus({ preventScroll: true });
});
for (const button of document.querySelectorAll("[data-close]"))
  button.addEventListener("click", () => button.closest("dialog").close());
$("#how-button").addEventListener("click", () => $("#how-dialog").showModal());
$("#settings-button").addEventListener("click", () =>
  $("#settings-dialog").showModal(),
);
$("#game-nav").addEventListener("click", () =>
  input.focus({ preventScroll: false }),
);
$("#motion-toggle").addEventListener("click", () => {
  preferences.motion = !preferences.motion;
  savePreferences();
  applyPreferences();
});
$("#motion-setting").addEventListener("change", (event) => {
  preferences.motion = event.target.checked;
  savePreferences();
  applyPreferences();
});
$("#intensity").addEventListener("input", (event) => {
  preferences.intensity = Number(event.target.value);
  savePreferences();
  applyPreferences();
});
reducedMotion.addEventListener("change", applyPreferences);
buildWave($("#wave-paths"));
resetRound();
applyPreferences();
// Load graphics independently: a driver or network failure cannot break the game.
import("./three-scene.js")
  .then(({ createNumberScene }) => createNumberScene($("#number-stage")))
  .then((renderer) => {
    scene = renderer;
    applyPreferences();
    scene.setNumber(visibleNumber, visualOutcome);
  })
  .catch((error) => {
    console.warn("NUMØ is using its static number fallback.", error);
    $("#scene-status").textContent = "STATIC DISPLAY — READY TO PLAY";
  });
