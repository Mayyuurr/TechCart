function calculateWeightZoneShipping(weight, zone) {
  if (weight === null || weight === undefined || typeof weight !== 'number' || isNaN(weight) || weight < 0) {
    throw new Error('Invalid weight');
  }
  const normalizedZone = (zone || '').toUpperCase();
  if (normalizedZone !== 'DOMESTIC' && normalizedZone !== 'INTERNATIONAL') {
    throw new Error('Invalid destination zone');
  }

  if (normalizedZone === 'DOMESTIC') {
    if (weight <= 10) return 5.00;
    if (weight <= 50) return 15.00;
    return 30.00; // > 50kg
  } else {
    // INTERNATIONAL
    if (weight <= 10) return 20.00;
    if (weight <= 50) return 50.00;
    return 100.00; // > 50kg
  }
}

module.exports = { calculateWeightZoneShipping };
