const { calculateTax } = require('../../src/utils/taxCalculator');

describe('White-Box Unit Test Suite: calculateTax', () => {
  it('should return 0 for negative or zero amounts (Branch 1)', () => {
    expect(calculateTax(-10, 'CA')).toBe(0);
    expect(calculateTax(0, 'NY')).toBe(0);
  });

  it('should calculate 8.25% tax for California (CA) (Branch 2)', () => {
    expect(calculateTax(100, 'CA')).toBe(8.25);
  });

  it('should calculate 8.875% tax for New York (NY) (Branch 3)', () => {
    expect(calculateTax(100, 'NY')).toBe(8.875);
  });

  it('should calculate 5% default tax for other states (Branch 4)', () => {
    expect(calculateTax(100, 'TX')).toBe(5.0);
    expect(calculateTax(200, 'FL')).toBe(10.0);
  });
});
