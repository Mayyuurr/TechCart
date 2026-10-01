const calculateShipping = (isPremiumMember, cartTotal) => {
    // Scenario 4: Free shipping if Premium OR Total > $50
    if (isPremiumMember || cartTotal > 50) {
        return 0;
    }
    return 10;
};

module.exports = { calculateShipping };
