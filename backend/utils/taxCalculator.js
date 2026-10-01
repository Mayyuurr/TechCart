function calculateTax(amount, state) {
  if (amount <= 0) return 0; // Branch 1
  if (state === 'CA') {       // Branch 2
    return amount * 0.0825;
  } else if (state === 'NY') {// Branch 3
    return amount * 0.08875;
  }
  return amount * 0.05;       // Branch 4 (Default)
}

module.exports = { calculateTax };
