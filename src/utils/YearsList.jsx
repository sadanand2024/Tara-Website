export const generateYears = (range = 10) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const startYear = currentYear - Math.floor(range / 2);

  return Array.from({ length: range }, (_, i) => startYear + i);
};
