function validateCartQuantity(quantity) {
  if (quantity === null || quantity === undefined || String(quantity).trim() === '') {
    return { isValid: false, error: 'Quantity is required' };
  }
  const num = Number(quantity);
  if (!Number.isInteger(num)) {
    return { isValid: false, error: 'Quantity must be a whole integer' };
  }
  if (num < 1 || num > 99) {
    return { isValid: false, error: 'Quantity must be between 1 and 99' };
  }
  return { isValid: true, error: null };
}

module.exports = { validateCartQuantity };
