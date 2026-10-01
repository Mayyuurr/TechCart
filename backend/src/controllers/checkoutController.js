function calculateCheckoutShipping(subtotal, useBuggyThreshold = false) {
  const amount = Number(subtotal);
  if (isNaN(amount) || amount < 0) {
    throw new Error('Invalid subtotal');
  }

  // DEMO BUG TOGGLE FOR BVA LECTURE:
  // Buggy Code (failing $50.00 exact boundary): const isFreeShipping = subtotal > 50.00;
  // Correct Code (passing 3-point BVA $49.99 / $50.00 / $50.01):
  const isFreeShipping = useBuggyThreshold ? (amount > 50.00) : (amount >= 50.00);
  const shippingFee = isFreeShipping ? 0.00 : 5.99;

  return {
    subtotal: amount,
    isFreeShipping,
    shippingFee,
    finalTotal: Number((amount + shippingFee).toFixed(2))
  };
}

module.exports = { calculateCheckoutShipping };
