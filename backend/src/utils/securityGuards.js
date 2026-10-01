function validateTextInputLength(text, maxLength = 10000) {
  if (text === null || text === undefined) return { isValid: true, error: null };
  if (typeof text !== 'string') {
    return { isValid: false, error: 'Input must be a string' };
  }
  if (text.length > maxLength) {
    return { isValid: false, error: `Input exceeds maximum allowed length of ${maxLength} characters` };
  }
  return { isValid: true, error: null };
}

function validateUnitPrice(price) {
  const num = Number(price);
  if (isNaN(num) || num <= 0) {
    return { isValid: false, error: 'Unit price must be a positive number greater than 0' };
  }
  return { isValid: true, error: null };
}

function sanitizeInputString(input) {
  if (typeof input === 'object' && input !== null) {
    throw new Error('Potential NoSQL injection detected: Object parameter not allowed');
  }
  return String(input);
}

module.exports = {
  validateTextInputLength,
  validateUnitPrice,
  sanitizeInputString
};
