export function calculateScore(correct: number, total: number): number {
  return Math.round((correct / total) * 100);
}

export function getScoreLabel(percentage: number): {
  label: string;
  color: string;
} {
  if (percentage >= 90) return { label: 'Extraordinário! 🏆', color: 'var(--accent-gold)' };
  if (percentage >= 70) return { label: 'Muito bom! 🌟', color: 'var(--accent-emerald)' };
  if (percentage >= 50) return { label: 'Bom esforço! 💪', color: 'var(--blue-300)' };
  return { label: 'Continue praticando! 📚', color: 'var(--accent-rose)' };
}
