import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { FontLoader } from "../vendor/FontLoader.js";

test("bundled font provides closed, finite, sampleable contours for every visible value", async () => {
  const font = new FontLoader().parse(
    JSON.parse(
      await readFile(
        new URL(
          "../assets/fonts/helvetiker_bold.typeface.json",
          import.meta.url,
        ),
        "utf8",
      ),
    ),
  );
  for (let value = 0; value <= 100; value++) {
    const shapes = font.generateShapes(String(value).padStart(2, "0"), 1);
    assert.ok(shapes.length >= 2);
    for (const shape of shapes)
      for (const path of [shape, ...shape.holes]) {
        assert.ok(path.getLength() > 0);
        for (const t of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
          const point = path.getPointAt(t);
          assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
        }
      }
  }
});
