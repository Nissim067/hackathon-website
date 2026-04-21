// Import the confetti launcher from canvas-confetti.
import confetti from 'canvas-confetti';

// Export a helper function that runs a 3-burst celebration.
export function celebrate() {
  // Define shared confetti colors.
  const colors = ['#6366F1', '#1D9E75', '#ffffff', '#F59E0B'];

  // Fire the first burst from the left side angled to the right.
  confetti({
    // Number of particles for this burst.
    particleCount: 90,
    // Spread value for directional effect.
    spread: 50,
    // Angle pointing to the right.
    angle: 60,
    // Launch position near left side.
    origin: { x: 0.1, y: 0.75 },
    // Use requested color palette.
    colors,
  });

  // Schedule second burst after 300ms.
  setTimeout(() => {
    // Fire a wide burst from center top.
    confetti({
      // Number of particles for center burst.
      particleCount: 120,
      // Wide spread for dramatic center effect.
      spread: 100,
      // Straight downward direction from top.
      angle: 90,
      // Launch from center upper area.
      origin: { x: 0.5, y: 0.1 },
      // Use requested color palette.
      colors,
    });
    // Delay exactly 300ms.
  }, 300);

  // Schedule third burst after another 300ms.
  setTimeout(() => {
    // Fire final burst from right side angled left.
    confetti({
      // Number of particles for final burst.
      particleCount: 90,
      // Spread value for directional effect.
      spread: 50,
      // Angle pointing to the left.
      angle: 120,
      // Launch position near right side.
      origin: { x: 0.9, y: 0.75 },
      // Use requested color palette.
      colors,
    });
    // Delay exactly 600ms total from start.
  }, 600);
}
