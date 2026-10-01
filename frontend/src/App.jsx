import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import ProductList from './components/ProductList';
import CheckoutCart from './components/CheckoutCart';

function App() {
  const [currentTab, setCurrentTab] = useState('products');
  const [cart, setCart] = useState([]);
  const [isPremiumMember, setIsPremiumMember] = useState(false);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= 10) {
        alert('Cannot add more than 10 of the same item!');
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`${product.name} added to cart!`);
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen text-white">
      <nav className="p-4 flex justify-between items-center sticky top-0 z-10 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <h1 className="text-2xl font-bold text-white tracking-wider">TechCart <span className="font-light">QA</span></h1>
        <div className="space-x-4">
          <button 
            data-cy="nav-register"
            onClick={() => setCurrentTab('register')}
            className={`font-medium px-4 py-2 rounded-full transition-all duration-300 ${currentTab === 'register' ? 'bg-white/30 shadow-inner' : 'hover:bg-white/20'}`}
          >
            Register
          </button>
          <button 
            data-cy="nav-products"
            onClick={() => setCurrentTab('products')}
            className={`font-medium px-4 py-2 rounded-full transition-all duration-300 ${currentTab === 'products' ? 'bg-white/30 shadow-inner' : 'hover:bg-white/20'}`}
          >
            Products
          </button>
          <button 
            data-cy="nav-cart"
            onClick={() => setCurrentTab('cart')}
            className={`font-medium px-4 py-2 rounded-full transition-all duration-300 ${currentTab === 'cart' ? 'bg-white/30 shadow-inner' : 'hover:bg-white/20'}`}
          >
            Cart ({totalCartItems})
          </button>
        </div>
      </nav>

      <main className="p-6">
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-yellow-500/20 backdrop-blur-md border border-yellow-300/30 rounded-xl shadow-lg flex items-center justify-between text-yellow-100">
          <span className="text-sm font-semibold tracking-wide">QA Test Tools:</span>
          <label className="flex items-center space-x-3 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPremiumMember}
              onChange={(e) => setIsPremiumMember(e.target.checked)}
              className="rounded bg-white/20 border-white/40 text-yellow-400 focus:ring-yellow-400/50 w-5 h-5"
            />
            <span>Toggle Premium Member (For free shipping testing)</span>
          </label>
        </div>

        {currentTab === 'register' && <RegistrationForm />}
        {currentTab === 'products' && <ProductList addToCart={addToCart} />}
        {currentTab === 'cart' && <CheckoutCart cart={cart} setCart={setCart} isPremiumMember={isPremiumMember} />}
      </main>

      <footer className="mt-20 border-t border-white/10 bg-black/20 text-white/50 text-sm text-center py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <p>&copy; 2026 TechCart QA. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
