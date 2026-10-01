function evaluatePromotionRules(isUserAuthenticated, orderTotal, promoCode) {
  if (!isUserAuthenticated) {
    return { status: 'LOGIN_REQUIRED', discount: 0, freeExpressShipping: false };
  }
  const hasValidCode = (promoCode === 'TECH20');
  const isOverHundred = orderTotal > 100.00;

  if (isOverHundred && hasValidCode) {
    return { status: 'SUCCESS', discount: 0.20, freeExpressShipping: true };
  } else if (isOverHundred && !hasValidCode) {
    return { status: 'SUCCESS', discount: 0.00, freeExpressShipping: true };
  } else if (!isOverHundred && hasValidCode) {
    return { status: 'SUCCESS', discount: 0.20, freeExpressShipping: false };
  }
  return { status: 'SUCCESS', discount: 0.00, freeExpressShipping: false };
}

module.exports = { evaluatePromotionRules };
