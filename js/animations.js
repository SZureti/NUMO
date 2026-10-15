/** Small DOM effects. These never block input or mutate gameplay state. */
export function animateFeedback(element, enabled) {
  if (!enabled || !element.animate) return;
  element.getAnimations().forEach((animation) => animation.cancel());
  element.animate(
    [
      { opacity: 0.2, transform: "translateY(6px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 280, easing: "ease-out" },
  );
}
export function buildWave(container) {
  // A family of sine curves echoes the sculpture without adding another WebGL canvas.
  for (let row = 0; row < 30; row++) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d = "";
    for (let x = 0; x <= 480; x += 5) {
      const y =
        155 + row * 3.2 + Math.sin(x / 84 + row * 0.045) * (44 + row * 1.6);
      d += `${x ? "L" : "M"}${x},${y.toFixed(2)} `;
    }
    path.setAttribute("d", d);
    path.setAttribute("stroke", "#7947ff");
    path.setAttribute("stroke-width", ".65");
    container.append(path);
  }
}
