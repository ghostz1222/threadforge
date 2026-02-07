const FIVE_SECONDS = 5000;

export function canGenerate(generationState) {
  const now = Date.now();

  if (generationState.lastAt && now - generationState.lastAt < FIVE_SECONDS) {
    return {
      allowed: false,
      reason: "Slow down a bit. You can create a new set every 5 seconds.",
    };
  }

  if (generationState.emailUnlocked) {
    return { allowed: true, reason: null };
  }

  if (generationState.used >= generationState.freeLimit) {
    return {
      allowed: false,
      reason: "Save your favorites with email to keep creating.",
    };
  }

  return { allowed: true, reason: null };
}
