const removeAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
};

export { removeAccents };