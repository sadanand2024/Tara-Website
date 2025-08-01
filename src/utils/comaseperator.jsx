export const formatNumberIN = (value) => {
  if (value === null || value === undefined || value === '' || isNaN(Number(value))) return 'NA';
  return Number(value).toLocaleString('en-IN');
};
