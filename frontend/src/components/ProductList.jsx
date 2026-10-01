import { useState, useEffect } from 'react';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = (category = 'all', query = '') => {
        let url = 'http://localhost:5000/api/products';
        if (query.trim()) {
            url = `http://localhost:5000/api/v1/products/search?q=${encodeURIComponent(query.trim())}`;
        } else if (category !== 'all') {
            url = `http://localhost:5000/api/products?category=${category}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.data && Array.isArray(data.data)) {
                    setProducts(data.data);
                } else if (Array.isArray(data)) {
                    setProducts(data);
                }
            })
            .catch(err => console.error("Error fetching products:", err));
    };

    useEffect(() => {
        fetchProducts(selectedCategory, searchQuery);
    }, [selectedCategory]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            fetchProducts(selectedCategory, searchQuery);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-12 text-white px-4 pb-20">
            
            {/* Minimalist Hero Section for Products */}
            <div className="text-center mb-8">
                <h2 className="text-5xl font-light tracking-tight mb-4 text-white">Our Collection</h2>
                <p className="text-xl text-blue-200 font-light max-w-2xl mx-auto">Discover premium technology crafted to elevate your everyday experience.</p>
            </div>

            {/* Search Bar with data-cy="search-input" */}
            <div className="max-w-md mx-auto mb-8">
                <div className="relative flex items-center">
                    <input 
                        type="text"
                        data-cy="search-input"
                        placeholder="Search products (e.g. laptop)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-12"
                    />
                    <button 
                        onClick={() => fetchProducts(selectedCategory, searchQuery)}
                        className="absolute right-3 p-2 text-white/70 hover:text-white transition"
                        title="Search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Category Filter buttons */}
            <div className="flex justify-center gap-4 mb-12">
                {['all', 'electronics', 'accessories'].map(cat => (
                    <button 
                        key={cat}
                        id={`filter-btn-${cat}`}
                        onClick={() => {
                            setSelectedCategory(cat);
                            setSearchQuery('');
                        }}
                        className={`px-6 py-2 rounded-full font-medium tracking-wide border transition-all duration-300 capitalize ${
                            selectedCategory === cat 
                            ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <div 
                        key={product.id || product.productId || product._id} 
                        data-cy="product-card"
                        className="group flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/20 hover:bg-white/20"
                    >
                        {/* Image Container */}
                        <div className="relative h-64 w-full bg-black/20 flex items-center justify-center p-6 overflow-hidden">
                            {/* Stock Indicator */}
                            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium tracking-wide border border-white/10 z-10">
                                {product.inStock !== false ? (
                                    <span className="text-green-400">● In Stock</span>
                                ) : (
                                    <span className="text-red-400">● Out of Stock</span>
                                )}
                            </div>

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
                            <p className="text-white/70 text-sm font-light mb-6 flex-grow leading-relaxed buggy-overlap-desc">{product.description || `${product.name} - high performance item`}</p>
                            
                            <button 
                                data-cy="add-to-cart-btn"
                                onClick={() => addToCart(product)}
                                disabled={product.inStock === false}
                                className={`w-full backdrop-blur-sm text-white border px-4 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg font-medium tracking-wide flex items-center justify-center gap-2 ${
                                    product.inStock !== false
                                    ? 'bg-blue-500/80 border-blue-400/50 hover:bg-blue-400' 
                                    : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed hover:scale-100'
                                }`}
                            >
                                {product.inStock !== false ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add to Cart
                                    </>
                                ) : (
                                    'Out of Stock'
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
