import test from "node:test";
import assert from "node:assert/strict";
import { NumberGame, STATES } from "../js/game.js";
const knownGame = () => new NumberGame(() => 0.46); // The deterministic test secret is 47.

test("new rounds initialize cleanly and include both range boundaries", () => {
  for (const [random, answer] of [
    [0, 1],
    [0.9999999, 100],
  ]) {
    const game = new NumberGame(() => random);
    assert.deepEqual(game.snapshot(), {
      state: STATES.READY,
      remaining: 5,
      history: [],
      revealedNumber: null,
    });
    assert.equal(game.submit(String(answer)).state, STATES.WON);
  }
});
test("all malformed input preserves attempts, history, state, and hidden number", () => {
  const game = knownGame();
  const initial = game.snapshot();
  for (const input of [
    "",
    " ",
    "hello",
    "3.5",
    "-5",
    "0",
    "101",
    "1e2",
    "+47",
    "47abc",
    "NaN",
    "Infinity",
    "1 0",
    "999999999999999999999",
  ]) {
    assert.equal(game.submit(input).ok, false, input);
    assert.deepEqual(game.snapshot(), initial, input);
  }
});
test("low/high feedback records ordered guesses and consumes exactly one attempt", () => {
  const game = knownGame();
  assert.equal(game.submit("32").direction, "low");
  assert.equal(game.submit("88").direction, "high");
  assert.equal(game.remaining, 3);
  assert.deepEqual(game.history, [
    { number: 32, direction: "low" },
    { number: 88, direction: "high" },
  ]);
  assert.equal(game.snapshot().revealedNumber, null);
});
test("numeric duplicates including leading zeros preserve attempts", () => {
  const game = knownGame();
  game.submit("32");
  const before = game.snapshot();
  assert.equal(game.submit("032").ok, false);
  assert.deepEqual(game.snapshot(), before);
});
test("a fifth correct guess wins and later submissions cannot mutate the game", () => {
  const game = knownGame();
  for (const n of [1, 2, 3, 4]) game.submit(String(n));
  assert.equal(game.submit("47").state, STATES.WON);
  assert.equal(game.remaining, 0);
  assert.equal(game.snapshot().revealedNumber, 47);
  const before = game.snapshot();
  assert.equal(game.submit("48").ok, false);
  assert.deepEqual(game.snapshot(), before);
});
test("five misses lose, reveal the answer, and never allow negative attempts", () => {
  const game = knownGame();
  for (const n of [1, 2, 3, 4, 5]) game.submit(String(n));
  assert.equal(game.state, STATES.LOST);
  assert.equal(game.snapshot().revealedNumber, 47);
  for (let i = 0; i < 10; i++) assert.equal(game.submit("47").ok, false);
  assert.equal(game.remaining, 0);
});
test("reset clears all gameplay state and performs an independent selection", () => {
  let index = 0;
  const values = [0.46, 0.46, 0.99];
  const game = new NumberGame(() => values[index++]);
  game.submit("47");
  game.reset();
  assert.equal(game.state, STATES.READY);
  assert.equal(game.remaining, 5);
  assert.equal(game.history.length, 0);
  assert.equal(game.submit("47").state, STATES.WON); // Consecutive identical secrets are allowed.
  game.reset();
  assert.equal(game.submit("100").state, STATES.WON);
});
test("snapshot consumers cannot mutate the recorded guess history", () => {
  const game = knownGame();
  game.submit("10");
  const copy = game.snapshot();
  copy.history[0].number = 47;
  assert.equal(game.history[0].number, 10);
});
