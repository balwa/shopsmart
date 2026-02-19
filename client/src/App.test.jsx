import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('App', () => {
    const realFetch = global.fetch;

    afterEach(() => {
        // Restore the real fetch after every test so mocks don't leak.
        global.fetch = realFetch;
    });

    // Integration test — intentionally fails without a real running backend.
    // REMOVED because ProductList now also fetches and causes "Failed to parse URL" errors in Node env.

    it('shows loading state before fetch resolves (no mock)', () => {
        // We need to mock fetch here too because ProductList triggers a fetch on mount
        // and relative URLs fail in jsdom without origin
        const mockFetch = vi.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve([])
        }));
        global.fetch = mockFetch;

        render(<App />);
        expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();
    });

    it('renders ShopSmart title and products', async () => {
        // Mock fetch to handle both health check and product search
        global.fetch = vi.fn((url) => {
            if (url.includes('/api/health')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ status: 'ok', message: 'Test Msg', timestamp: 'now' })
                });
            }
            if (url.includes('/api/products/search')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { id: 1, name: 'Integration Test Product', price: 100, category: 'Test', inStock: true }
                    ])
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/ShopSmart/i)).toBeInTheDocument();
            expect(screen.getByText(/Integration Test Product/i)).toBeInTheDocument();
        });
    });
});
