
export const formatFileSize = (size: number) => {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(size / 1000);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(number);
};
