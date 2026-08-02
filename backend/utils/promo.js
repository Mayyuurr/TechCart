function applyPromoCode(total, code){
    if (code === 'SAVE10') {
        if (total < 20) {
            throw new Error('Promo code SAVE10 cannot be applied to orders under $20');
        }
        return total - (total * 0.10);
    }
    if (code === 'EXPIRED10') {
        throw new Error('Promo code is expired');
    }
}

module.exports = {applyPromoCode};