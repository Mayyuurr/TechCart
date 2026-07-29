function applyPromoCode(total, code){
    if(code === 'SAVE10'){
        return total-(total * 0.10);
    }
}

module.exports = {applyPromoCode};