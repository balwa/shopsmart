import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = (query = '') => {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL || '';
        // In real app, you might use URLSearchParams, but simple string concat for now
        const url = `${apiUrl}/api/products/search?q=${encodeURIComponent(query)}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch products');
                return res.json();
            })
            .then(data => setProducts(data))
            .catch(err => {
                console.error(err);
                setError(err.message);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    };

    // Initial load
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <div className="product-list-container">
            <h2>Our Products</h2>

            <SearchBar onSearch={fetchProducts} />

            {loading && <p>Loading products...</p>}
            {error && <p className="error">Error: {error}</p>}

            {!loading && !error && products.length === 0 && (
                <p>No products found.</p>
            )}

            <div className="product-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>
        </div>
    );
}

export default ProductList;
