const {applyPromoCode}= require("../utils/promo");

test("Applies 10% discount for code SAVE10", () => {
    const cartTotal = 100;
    const result = applyPromoCode(cartTotal, 'SAVE10');
    expect(result).toBe(90);
});