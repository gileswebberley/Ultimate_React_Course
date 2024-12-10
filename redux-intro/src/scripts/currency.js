export function formatCurrency(value, currency) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency,
  }).format(value);
}
