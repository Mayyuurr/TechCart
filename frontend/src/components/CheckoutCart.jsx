import { useState } from 'react';

const CheckoutCart = ({ cart, setCart, isPremiumMember }) => {
    const [checkoutResult, setCheckoutResult] = useState(null);
    const [error, setError] = useState(null);
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [showPaypalMock, setShowPaypalMock] = useState(false);

    const removeItem = async (product) => {
        try {
            await fetch(`http://localhost:5000/api/cart/${product.id}`, {
                method: 'DELETE'
            });
            console.log(`Product ${product.id} removed from backend cart`);
        } catch (err) {
            console.error("Failed to delete cart item on backend:", err);
        }
        setCart(cart.filter(item => item.id !== product.id));
    };

    const updateQuantity = (product, newQuantity) => {
        // Scenario 3: Order Quantity Boundaries (Max 10)
        if (newQuantity > 10) {
            alert('Cannot add more than 10 of the same item!');
            return;
        }
        if (newQuantity <= 0) {
            removeItem(product);
        } else {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item));
        }
    };

    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (code === 'SAVE10') {
            if (subtotal < 20) {
                setError('Promo code SAVE10 cannot be applied to orders under $20');
                setPromoDiscount(0);
                setAppliedPromo('');
            } else {
                setPromoDiscount(0.1);
                setAppliedPromo('SAVE10');
                setError(null);
            }
        } else if (code === 'EXPIRED10') {
            setError('Promo code is expired');
            setPromoDiscount(0);
            setAppliedPromo('EXPIRED10');
        } else {
            setError('Invalid promo code. Try SAVE10.');
            setPromoDiscount(0);
            setAppliedPromo(code);
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountAmount = subtotal * promoDiscount;
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * 0.1;
    const shipping = (isPremiumMember || discountedSubtotal > 50) ? 0 : 10;
    const finalTotal = discountedSubtotal + tax + shipping;

    const handleCheckout = async () => {
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart, isPremiumMember, promoCode: appliedPromo })
            });

            const data = await res.json();
            
            if (!res.ok) {
                setError(data.error || 'Checkout failed');
            } else {
                // Incorporate promo discount if applied
                if (promoDiscount > 0) {
                    data.rawTotal = subtotal;
                    data.discount = discountAmount;
                    data.tax = tax;
                    data.shipping = shipping;
                    data.finalTotal = finalTotal;
                }
                setCheckoutResult(data);
                setCart([]); // clear cart
                setShowPaypalMock(false);
            }
        } catch (err) {
            setError('Network error during checkout');
        }
    };

    if (cart.length === 0 && !checkoutResult) {
        return <div className="text-center mt-10 text-gray-500">Your cart is empty.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl text-white">
            <h2 className="text-3xl font-light mb-8 tracking-wider">Checkout Cart</h2>
            
            {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 backdrop-blur-md">{error}</div>}

            <div className="space-y-4">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div>
                            <h4 className="font-medium text-lg">{item.name}</h4>
                            <p className="text-sm text-blue-200">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-4 bg-white/5 p-2 rounded-xl">
                            <button 
                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                className="bg-white/10 hover:bg-white/20 transition px-3 py-1 rounded-lg text-white font-bold"
                            >-</button>
                            <span className="w-6 text-center font-medium">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item, item.quantity + 1)}
                                className="bg-white/10 hover:bg-white/20 transition px-3 py-1 rounded-lg text-white font-bold"
                            >+</button>
                            <span className="font-bold w-24 text-right text-blue-200">${item.price * item.quantity}</span>
                            <button 
                                onClick={() => removeItem(item)}
                                className="text-red-400 hover:text-red-300 transition text-sm ml-2"
                                id={`remove-btn-${item.id}`}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Promo Code Input */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                        <div>
                            <h3 className="font-medium text-lg mb-2">Have a Promo Code?</h3>
                            <p className="text-xs text-white/50 mb-4">Enter your promo code to claim a discount. Try <b>SAVE10</b> for 10% off.</p>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value)}
                                placeholder="Promo code"
                                className="flex-1 px-4 py-2 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                            <button 
                                onClick={handleApplyPromo}
                                className="bg-blue-500/80 hover:bg-blue-400 px-4 py-2 rounded-xl font-medium transition"
                            >
                                Apply
                            </button>
                        </div>
                        {appliedPromo && (
                            <p className="text-green-400 text-sm mt-2">Code {appliedPromo} applied successfully!</p>
                        )}
                    </div>

                    {/* Price Breakdown Preview */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
                        <h3 className="font-medium text-lg mb-4">Order Summary</h3>
                        <div className="flex justify-between text-sm text-white/80">
                            <span>Subtotal:</span>
                            <span>${subtotal}</span>
                        </div>
                        {promoDiscount > 0 && (
                            <div className="flex justify-between text-sm text-green-400">
                                <span>Promo Discount (10%):</span>
                                <span>-${discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-white/80">
                            <span>Tax (10%):</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-white/80">
                            <span>Shipping:</span>
                            <span>${shipping}</span>
                        </div>
                        <hr className="border-white/10 my-2" />
                        <div className="flex justify-between text-xl font-bold">
                            <span>Estimated Total:</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            {cart.length > 0 && (
                <div className="mt-8 flex flex-col items-end space-y-4">
                    <button 
                        onClick={() => setShowPaypalMock(true)}
                        className="bg-yellow-500 hover:bg-yellow-600 transition shadow-lg shadow-yellow-500/30 text-black px-8 py-3 rounded-full font-medium flex items-center gap-2"
                        id="paypal-checkout-btn"
                    >
                        <span className="font-bold italic">PayPal</span> Checkout
                    </button>
                    
                    <button 
                        onClick={handleCheckout}
                        className="bg-blue-500 hover:bg-blue-600 transition shadow-lg shadow-blue-500/30 text-white px-8 py-3 rounded-full font-medium"
                        id="checkout-btn-v2"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            )}

            {/* Paypal Modal Mock */}
            {showPaypalMock && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-neutral-900 border border-white/20 p-8 rounded-3xl max-w-md w-full shadow-2xl text-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold italic text-yellow-500">PayPal Checkout</h3>
                            <button onClick={() => setShowPaypalMock(false)} className="text-white/50 hover:text-white">&times;</button>
                        </div>
                        <p className="text-sm text-white/80 mb-6">
                            Log in to your PayPal account to finalize payment of <b>${finalTotal.toFixed(2)}</b>.
                        </p>
                        <div className="space-y-4">
                            <input 
                                type="email" 
                                placeholder="PayPal Email" 
                                defaultValue="paypal-tester@email.com"
                                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl"
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                defaultValue="12345678"
                                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl"
                            />
                            <button 
                                onClick={handleCheckout}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-xl font-bold transition mt-4"
                            >
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {checkoutResult && (
                <div className="mt-8 p-6 bg-green-500/10 backdrop-blur-md border border-green-400/30 rounded-2xl">
                    <h3 className="text-2xl font-light text-green-300 mb-4">Order Confirmed!</h3>
                    <div className="space-y-2 text-white/90">
                        <p className="flex justify-between"><span>Subtotal:</span> <span className="font-medium">${checkoutResult.rawTotal}</span></p>
                        {checkoutResult.discount > 0 && (
                            <p className="flex justify-between text-green-400"><span>Promo Discount:</span> <span className="font-medium">-${checkoutResult.discount.toFixed(2)}</span></p>
                        )}
                        <p className="flex justify-between"><span>Tax (10%):</span> <span className="font-medium">${checkoutResult.tax.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>Shipping:</span> <span className="font-medium">${checkoutResult.shipping}</span></p>
                        <hr className="my-4 border-white/10" />
                        <p className="flex justify-between text-xl font-bold text-white"><span>Total Paid:</span> <span>${checkoutResult.finalTotal.toFixed(2)}</span></p>
                    </div>
                    <button 
                        onClick={() => setCheckoutResult(null)}
                        className="mt-6 bg-white/15 hover:bg-white/20 transition px-6 py-2 rounded-xl text-sm font-medium"
                    >
                        Shop Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default CheckoutCart;
