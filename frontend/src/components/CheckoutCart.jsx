import { useState } from 'react';

const CheckoutCart = ({ cart, setCart, isPremiumMember }) => {
    const [checkoutResult, setCheckoutResult] = useState(null);
    const [error, setError] = useState(null);

    const updateQuantity = (product, newQuantity) => {
        // Scenario 3: Order Quantity Boundaries (Max 10)
        if (newQuantity > 10) {
            alert('Cannot add more than 10 of the same item!');
            return;
        }
        if (newQuantity <= 0) {
            setCart(cart.filter(item => item.id !== product.id));
        } else {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item));
        }
    };

    const handleCheckout = async () => {
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart, isPremiumMember })
            });

            const data = await res.json();
            
            if (!res.ok) {
                setError(data.error || 'Checkout failed');
            } else {
                setCheckoutResult(data);
                setCart([]); // clear cart
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
                        </div>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleCheckout}
                        className="bg-blue-500 hover:bg-blue-600 transition shadow-lg shadow-blue-500/30 text-white px-8 py-3 rounded-full font-medium"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            )}

            {checkoutResult && (
                <div className="mt-8 p-6 bg-green-500/10 backdrop-blur-md border border-green-400/30 rounded-2xl">
                    <h3 className="text-2xl font-light text-green-300 mb-4">Order Confirmed!</h3>
                    <div className="space-y-2 text-white/90">
                        <p className="flex justify-between"><span>Subtotal:</span> <span className="font-medium">${checkoutResult.rawTotal}</span></p>
                        <p className="flex justify-between"><span>Tax (10%):</span> <span className="font-medium">${checkoutResult.tax}</span></p>
                        <p className="flex justify-between"><span>Shipping:</span> <span className="font-medium">${checkoutResult.shipping}</span></p>
                        <hr className="my-4 border-white/10" />
                        <p className="flex justify-between text-xl font-bold text-white"><span>Total:</span> <span>${checkoutResult.finalTotal}</span></p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutCart;
