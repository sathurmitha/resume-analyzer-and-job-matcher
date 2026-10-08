const USD_TO_INR = Number(import.meta.env.VITE_USD_TO_INR) || 83.5;

const formatIndianAmount = (amount) => {
  return Math.round(amount).toLocaleString('en-IN');
};

export const formatSalary = (salary) => {
  if (!salary) return 'Not specified';

  const value = String(salary);
  if (value.includes('₹')) return value;

  return value
    .replace(/\$\s*([\d,]+(?:\.\d+)?)/g, (_, amount) => {
      const dollars = Number(amount.replace(/,/g, ''));
      return `₹${formatIndianAmount(dollars * USD_TO_INR)}`;
    })
    .replace(/\bUSD\s*([\d,]+(?:\.\d+)?)/gi, (_, amount) => {
      const dollars = Number(amount.replace(/,/g, ''));
      return `₹${formatIndianAmount(dollars * USD_TO_INR)}`;
    });
};
