const { calculateSimilarity } = require('../../src/utils/similarity');

describe('Unit Test Suite: calculateSimilarity (AAA Pattern Demonstration)', () => {
  it('should return 1.0 when comparing two identical strings', () => {
    // 1. ARRANGE
    const stringA = 'TechCart';
    const stringB = 'TechCart';

    // 2. ACT
    const result = calculateSimilarity(stringA, stringB);

    // 3. ASSERT
    expect(result).toBe(1.0);
  });

  it('should return a fractional similarity score for partially matching strings', () => {
    // 1. ARRANGE
    const stringA = 'laptop';
    const stringB = 'desktop';

    // 2. ACT
    const result = calculateSimilarity(stringA, stringB);

    // 3. ASSERT
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1.0);
  });

  it('should throw an error when null or undefined arguments are provided', () => {
    // 1. ARRANGE
    const invalidInput = null;
    const validInput = 'laptop';

    // 2. ACT & 3. ASSERT
    expect(() => calculateSimilarity(invalidInput, validInput)).toThrow('Invalid string input');
    expect(() => calculateSimilarity(validInput, undefined)).toThrow('Invalid string input');
  });
});
