function calculateSimilarity(strA, strB) {
  if (strA === null || strB === null || strA === undefined || strB === undefined) {
    throw new Error('Invalid string input');
  }
  if (strA === strB) return 1.0;
  // Basic similarity check logic
  const setA = new Set(strA.toLowerCase().split(''));
  const setB = new Set(strB.toLowerCase().split(''));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

module.exports = { calculateSimilarity };
