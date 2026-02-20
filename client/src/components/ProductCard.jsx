import React from 'react';
import { formatPrice, getStockLabel } from '../utils';

function ProductCard({ product, onAddToCart }) {
    const isStocked = product.inStock;

    return (
        <div className="product-card" data-testid={`product-card-${product.id}`}>
            <h3>{product.name}</h3>
            <div className="category">{product.category}</div>
            <div className="price">{formatPrice(product.price)}</div>

            <span className={`stock-badge ${isStocked ? 'in-stock' : 'out-of-stock'}`}>
                {getStockLabel(isStocked)}
            </span>

            <button
                className="add-to-cart-btn"
                onClick={() => onAddToCart(product)}
                disabled={!isStocked}
            >
                {isStocked ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    );
}

export default ProductCard;
