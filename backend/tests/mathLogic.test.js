const { calculateTotal } = require('../utils/mathLogic');

describe('calculateTotal', () => {
    it('should calculate the total cost including tax', () => {
        const price = 100;
        const tax = 15;

        // This test will fail intentionally due to the bug in mathLogic.js
        expect(calculateTotal(price, tax)).toBe(110);
    });
});
