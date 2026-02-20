import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ProductList from './ProductList';

describe('ProductList Integration', () => {
    const mockProducts = [
        { id: 1, name: 'Phone', category: 'Electronics', price: 50000, inStock: true },
        { id: 2, name: 'Shirt', category: 'Clothing', price: 2000, inStock: true },
    ];

    const realFetch = global.fetch;

    afterEach(() => {
        global.fetch = realFetch;
        vi.restoreAllMocks();
    });

    it('fetches and displays products on mount', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockProducts)
            })
        );

        render(<ProductList />);

        expect(screen.getByText(/loading products/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Phone')).toBeInTheDocument();
            expect(screen.getByText('Shirt')).toBeInTheDocument();
        });
    });

    it('handles search interaction', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([mockProducts[0]]) // Return only phone
            })
        );

        render(<ProductList />);

        // Simulate typing and searching
        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: 'phone' } });
        fireEvent.submit(screen.getByRole('search'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('q=phone'));
        });
    });

    it('displays error message when fetch fails', async () => {
        global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

        render(<ProductList />);

        await waitFor(() => {
            expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
            // Should verify that the user can see the error
        });
    });
});
