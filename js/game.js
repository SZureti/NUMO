/** Pure game rules. No DOM or animation dependencies: rendering cannot affect a result. */
export const STATES = Object.freeze({
  READY: "READY",
  PLAYING: "PLAYING",
  WON: "WON",
  LOST: "LOST",
});
export const MAX_ATTEMPTS = 5;
export class NumberGame {
  #secret;
  #random;
  constructor(random = Math.random) {
    this.#random = random;
    this.reset();
  }
  reset() {
    this.#secret = Math.floor(this.#random() * 100) + 1;
    this.state = STATES.READY;
    this.history = [];
    this.remaining = MAX_ATTEMPTS;
    return this.snapshot();
  }
  snapshot() {
    // The secret is never exposed to the UI until the round has ended.
    return {
      state: this.state,
      remaining: this.remaining,
      history: this.history.map((item) => ({ ...item })),
      revealedNumber: this.isFinished ? this.#secret : null,
    };
  }
  get isFinished() {
    return this.state === STATES.WON || this.state === STATES.LOST;
  }
  submit(raw) {
    if (this.isFinished)
      return { ok: false, error: "This round is complete. Start a new game." };
    const text = String(raw).trim();
    if (!text)
      return { ok: false, error: "Enter a whole number from 1 to 100." };
    // Strict syntax prevents parseInt-style acceptance of “47hello”, “3.5”, or “1e2”.
    if (!/^\d+$/.test(text))
      return {
        ok: false,
        error: "Use a whole number — no letters, decimals, or symbols.",
      };
    const number = Number(text);
    if (!Number.isSafeInteger(number) || number < 1 || number > 100)
      return { ok: false, error: "Your number must be between 1 and 100." };
    if (this.history.some((guess) => guess.number === number))
      return {
        ok: false,
        error: "You’ve already tried that number. Try a different one.",
      };
    const direction =
      number === this.#secret
        ? "correct"
        : number < this.#secret
          ? "low"
          : "high";
    this.history.push({ number, direction });
    this.remaining -= 1;
    // Check success before exhaustion so a correct fifth guess always wins.
    this.state =
      direction === "correct"
        ? STATES.WON
        : this.remaining === 0
          ? STATES.LOST
          : STATES.PLAYING;
    return { ok: true, number, direction, ...this.snapshot() };
  }
}
