function applyPromoCode(total, code){
    if (code === 'SAVE10') {
        if (total < 20) {
            throw new Error('Promo code SAVE10 cannot be applied to orders under $20');
        }
        return total - (total * 0.10);
    }
    if (code === 'TECH20') {
        if (total < 20) {
            throw new Error('Promo code TECH20 cannot be applied to orders under $20');
        }
        return total - (total * 0.20);
    }
    if (code === 'EXPIRED10') {
        throw new Error('Promo code is expired');
    }
    throw new Error('Invalid promo code');
}

module.exports = {applyPromoCode};
