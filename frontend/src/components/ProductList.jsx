import { useState, useEffect } from 'react';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from our mock backend
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    return (
        <div className="max-w-6xl mx-auto mt-12 text-white px-4 pb-20">
            
            {/* Minimalist Hero Section for Products */}
            <div className="text-center mb-16">
                <h2 className="text-5xl font-light tracking-tight mb-4 text-white">Our Collection</h2>
                <p className="text-xl text-blue-200 font-light max-w-2xl mx-auto">Discover premium technology crafted to elevate your everyday experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <div key={product.id} className="group flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/20 hover:bg-white/20">
                        {/* Image Container */}
                        <div className="relative h-64 w-full bg-black/20 flex items-center justify-center p-6 overflow-hidden">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="text-white/30 text-sm italic">No image available</div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold tracking-wide border border-white/30">
                                ${product.price}
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-2xl font-medium mb-2 tracking-wide">{product.name}</h3>
                            <p className="text-white/70 text-sm font-light mb-6 flex-grow leading-relaxed">{product.description}</p>
                            
                            <button 
                                onClick={() => addToCart(product)}
                                className="w-full bg-blue-500/80 backdrop-blur-sm text-white border border-blue-400/50 px-4 py-3 rounded-xl hover:bg-blue-400 hover:scale-[1.02] active:scale-95 transition-all shadow-lg font-medium tracking-wide flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
