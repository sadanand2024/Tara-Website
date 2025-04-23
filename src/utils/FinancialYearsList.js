export const generateFinancialYears = (range = 10) => {
  const today = new Date();
  const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1; // April is month 3 (0-based)
  const startYear = currentYear - Math.floor(range / 2);

  return Array.from({ length: range }, (_, i) => {
    const year = startYear + i;
    return `${year}-${String(
      year + 1

      // % 100
    ).padStart(2, '0')}`;
  });
};
