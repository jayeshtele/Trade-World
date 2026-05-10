export const formatINR = (value, maximumFractionDigits = 2) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  }).format(value || 0);

export const formatNumber = (value) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(value || 0);

export const formatPercent = (value) =>
  `${value >= 0 ? '+' : ''}${Number(value || 0).toFixed(2)}%`;

export const getChange = (asset) => {
  const change = (asset?.price || 0) - (asset?.previousClose || 0);
  const changePercent = asset?.previousClose ? (change / asset.previousClose) * 100 : 0;

  return {
    change,
    changePercent,
    isPositive: change >= 0,
  };
};
