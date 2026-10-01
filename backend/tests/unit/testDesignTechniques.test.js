const { validateCartQuantity } = require('../../src/utils/validators');
const { calculateWeightZoneShipping } = require('../../src/services/shippingCalculator');
const { calculateCheckoutShipping } = require('../../src/controllers/checkoutController');
const { evaluatePromotionRules } = require('../../src/services/promotionEngine');
const { transitionOrderState } = require('../../src/services/orderStateMachine');
const { validateTextInputLength, validateUnitPrice, sanitizeInputString } = require('../../src/utils/securityGuards');

describe('Module 3 Chapter 2: Test Case Design Techniques Suite', () => {

  // =========================================================================
  // 1. EQUIVALENCE PARTITIONING (EP)
  // =========================================================================
  describe('1. Equivalence Partitioning (EP)', () => {
    describe('Quantity Input Validator Partitions', () => {
      it('EP Valid Partition [1-99]: accepts integer values within range', () => {
        expect(validateCartQuantity(1)).toEqual({ isValid: true, error: null });
        expect(validateCartQuantity(15)).toEqual({ isValid: true, error: null });
        expect(validateCartQuantity(99)).toEqual({ isValid: true, error: null });
      });

      it('EP Invalid Partition (Empty/Null): rejects missing or whitespace input', () => {
        expect(validateCartQuantity(null).isValid).toBe(false);
        expect(validateCartQuantity(undefined).isValid).toBe(false);
        expect(validateCartQuantity('').isValid).toBe(false);
        expect(validateCartQuantity('   ').isValid).toBe(false);
      });

      it('EP Invalid Partition (Non-Integer): rejects decimals and non-numeric strings', () => {
        expect(validateCartQuantity(3.14)).toEqual({ isValid: false, error: 'Quantity must be a whole integer' });
        expect(validateCartQuantity('abc')).toEqual({ isValid: false, error: 'Quantity must be a whole integer' });
      });

      it('EP Invalid Partition (Out of Range): rejects values < 1 or > 99', () => {
        expect(validateCartQuantity(0)).toEqual({ isValid: false, error: 'Quantity must be between 1 and 99' });
        expect(validateCartQuantity(-10)).toEqual({ isValid: false, error: 'Quantity must be between 1 and 99' });
        expect(validateCartQuantity(100)).toEqual({ isValid: false, error: 'Quantity must be between 1 and 99' });
      });
    });

    describe('Multi-Variable Shipping Matrix Partitions', () => {
      it('calculates domestic shipping tiers (0-10kg, 10.1-50kg, >50kg)', () => {
        expect(calculateWeightZoneShipping(5, 'DOMESTIC')).toBe(5.00);
        expect(calculateWeightZoneShipping(25, 'DOMESTIC')).toBe(15.00);
        expect(calculateWeightZoneShipping(60, 'DOMESTIC')).toBe(30.00);
      });

      it('calculates international shipping tiers (0-10kg, 10.1-50kg, >50kg)', () => {
        expect(calculateWeightZoneShipping(5, 'INTERNATIONAL')).toBe(20.00);
        expect(calculateWeightZoneShipping(25, 'INTERNATIONAL')).toBe(50.00);
        expect(calculateWeightZoneShipping(60, 'INTERNATIONAL')).toBe(100.00);
      });
    });
  });

  // =========================================================================
  // 2. BOUNDARY VALUE ANALYSIS (BVA)
  // =========================================================================
  describe('2. Boundary Value Analysis (BVA)', () => {
    describe('Decimal Free Shipping 3-Point Boundary ($50.00)', () => {
      it('BVA Just Below Boundary ($49.99): charges standard shipping $5.99', () => {
        const result = calculateCheckoutShipping(49.99);
        expect(result.isFreeShipping).toBe(false);
        expect(result.shippingFee).toBe(5.99);
        expect(result.finalTotal).toBe(55.98);
      });

      it('BVA On Exact Boundary ($50.00): qualifies for free shipping $0.00', () => {
        const result = calculateCheckoutShipping(50.00);
        expect(result.isFreeShipping).toBe(true);
        expect(result.shippingFee).toBe(0.00);
        expect(result.finalTotal).toBe(50.00);
      });

      it('BVA Just Above Boundary ($50.01): qualifies for free shipping $0.00', () => {
        const result = calculateCheckoutShipping(50.01);
        expect(result.isFreeShipping).toBe(true);
        expect(result.shippingFee).toBe(0.00);
        expect(result.finalTotal).toBe(50.01);
      });

      it('demonstrates off-by-one bug failure when toggle is active (> 50.00 vs >= 50.00)', () => {
        const buggyResult = calculateCheckoutShipping(50.00, true);
        // Under buggy code, $50.00 incorrectly fails to get free shipping
        expect(buggyResult.isFreeShipping).toBe(false);
      });
    });

    describe('Quantity 3-Point Boundary Analysis (0, 1, 2 | 98, 99, 100)', () => {
      it('Lower Boundary: 0 (invalid), 1 (min valid), 2 (valid)', () => {
        expect(validateCartQuantity(0).isValid).toBe(false);
        expect(validateCartQuantity(1).isValid).toBe(true);
        expect(validateCartQuantity(2).isValid).toBe(true);
      });

      it('Upper Boundary: 98 (valid), 99 (max valid), 100 (invalid)', () => {
        expect(validateCartQuantity(98).isValid).toBe(true);
        expect(validateCartQuantity(99).isValid).toBe(true);
        expect(validateCartQuantity(100).isValid).toBe(false);
      });
    });
  });

  // =========================================================================
  // 3. DECISION TABLE TESTING (2^N COMBINATORIAL ENGINE)
  // =========================================================================
  describe('3. Decision Table Testing', () => {
    it('Rule 1 (True, >100, TECH20): 20% discount + free express shipping', () => {
      const result = evaluatePromotionRules(true, 150.00, 'TECH20');
      expect(result).toEqual({ status: 'SUCCESS', discount: 0.20, freeExpressShipping: true });
    });

    it('Rule 2 (True, >100, !TECH20): 0% discount + free express shipping', () => {
      const result = evaluatePromotionRules(true, 150.00, 'INVALID');
      expect(result).toEqual({ status: 'SUCCESS', discount: 0.00, freeExpressShipping: true });
    });

    it('Rule 3 (True, <=100, TECH20): 20% discount + no express shipping', () => {
      const result = evaluatePromotionRules(true, 80.00, 'TECH20');
      expect(result).toEqual({ status: 'SUCCESS', discount: 0.20, freeExpressShipping: false });
    });

    it('Rule 4 (True, <=100, !TECH20): 0% discount + no express shipping', () => {
      const result = evaluatePromotionRules(true, 80.00, 'INVALID');
      expect(result).toEqual({ status: 'SUCCESS', discount: 0.00, freeExpressShipping: false });
    });

    it('Rule 5 Collapsed (False, --, --): short-circuits to LOGIN_REQUIRED', () => {
      const result = evaluatePromotionRules(false, 500.00, 'TECH20');
      expect(result).toEqual({ status: 'LOGIN_REQUIRED', discount: 0, freeExpressShipping: false });
    });
  });

  // =========================================================================
  // 4. STATE TRANSITION TESTING (FINITE STATE MACHINE)
  // =========================================================================
  describe('4. State Transition Testing', () => {
    it('executes valid primary lifecycle (CART -> CHECKOUT -> PAID -> SHIPPED -> DELIVERED)', () => {
      let state = 'CART';
      state = transitionOrderState({ status: state }, 'CHECKOUT');
      expect(state).toBe('CHECKOUT');

      state = transitionOrderState({ status: state }, 'PAY');
      expect(state).toBe('PAID');

      state = transitionOrderState({ status: state }, 'SHIP');
      expect(state).toBe('SHIPPED');

      state = transitionOrderState({ status: state }, 'DELIVER');
      expect(state).toBe('DELIVERED');
    });

    it('allows valid cancellation from CHECKOUT state', () => {
      const nextState = transitionOrderState({ status: 'CHECKOUT' }, 'CANCEL');
      expect(nextState).toBe('CANCELLED');
    });

    it('allows valid refund from PAID state', () => {
      const nextState = transitionOrderState({ status: 'PAID' }, 'REFUND');
      expect(nextState).toBe('REFUNDED');
    });

    it('ILLEGAL GUARD: throws 400 when attempting to cancel an order already SHIPPED', () => {
      expect(() => {
        transitionOrderState({ status: 'SHIPPED' }, 'CANCEL');
      }).toThrow('Cannot cancel an order that has already been shipped');
    });
  });

  // =========================================================================
  // 5. ERROR GUESSING & HEURISTIC SECURITY GUARDS
  // =========================================================================
  describe('5. Error Guessing & Heuristic Security Guards', () => {
    it('Buffer / Length Guard: rejects notes exceeding 10,000 characters without crashing', () => {
      const validText = 'a'.repeat(5000);
      const invalidText = 'a'.repeat(10001);

      expect(validateTextInputLength(validText).isValid).toBe(true);
      expect(validateTextInputLength(invalidText).isValid).toBe(false);
    });

    it('UTF-8 Support: accepts multilingual text and emojis cleanly', () => {
      const emojiInput = 'Alex 🍕 - Order note with Unicode 🔥';
      expect(validateTextInputLength(emojiInput).isValid).toBe(true);
    });

    it('Negative / Zero Unit Price Guard: rejects unit prices <= 0', () => {
      expect(validateUnitPrice(0).isValid).toBe(false);
      expect(validateUnitPrice(-19.99).isValid).toBe(false);
      expect(validateUnitPrice(29.99).isValid).toBe(true);
    });

    it('NoSQL Injection Guard: rejects object inputs targeting query selectors', () => {
      expect(() => sanitizeInputString({ '$gt': '' })).toThrow('Potential NoSQL injection detected');
      expect(sanitizeInputString('valid-string')).toBe('valid-string');
    });
  });
});
