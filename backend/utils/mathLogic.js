const calculateTotal = (price, tax) => {
    // BUG: Intentionally subtracting tax instead of adding it (Scenario 2)
    return price - tax;
};

module.exports = { calculateTotal };
