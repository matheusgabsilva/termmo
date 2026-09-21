// Utility functions for text normalization
const removeAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase();
};

export { removeAccents };