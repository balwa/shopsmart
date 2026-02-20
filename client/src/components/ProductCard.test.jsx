import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';

describe('ProductCard Component', () => {
    const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 999,
        category: 'Test Category',
        inStock: true
    };

    it('renders product details correctly', () => {
        render(<ProductCard product={mockProduct} onAddToCart={() => { }} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('Test Category')).toBeInTheDocument();
        expect(screen.getByText('$9.99')).toBeInTheDocument();
        expect(screen.getByText('In Stock')).toBeInTheDocument();
    });

    it('buttons adds to cart when clicked', () => {
        const handleAddToCart = vi.fn();
        render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);

        const button = screen.getByRole('button', { name: /add to cart/i });
        fireEvent.click(button);

        expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('disables button when out of stock', () => {
        const outOfStockProduct = { ...mockProduct, inStock: false };
        render(<ProductCard product={outOfStockProduct} onAddToCart={() => { }} />);

        const button = screen.getByRole('button', { name: /out of stock/i });
        expect(button).toBeDisabled();

        // Use getAllByText since it appears in both badge and button
        const badges = screen.getAllByText('Out of Stock');
        expect(badges.length).toBeGreaterThan(0);
    });
});
