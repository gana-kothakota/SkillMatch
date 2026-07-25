export const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatSalaryRange = (min, max, currency = 'USD') => {
  if (!min && !max) return 'Competitive';
  if (min && !max) return `${formatCurrency(min, currency)}+`;
  if (!min && max) return `Up to ${formatCurrency(max, currency)}`;
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
};

export const formatSalary = formatSalaryRange;
