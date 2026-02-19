import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

const BACKEND_URL = 'http://localhost:5001';

describe('App Integration (Real Backend)', () => {
    const originalFetch = global.fetch;

    beforeAll(() => {
        // Redirect relative URLs to the real backend
        global.fetch = async (input, init) => {
            let url = input;
            if (typeof url === 'string' && url.startsWith('/')) {
                url = `${BACKEND_URL}${url}`;
            }
            console.log(`[TEST] Fetching: ${url}`);
            return originalFetch(url, init);
        };
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    it('successfully connects to the backend and renders data', async () => {
        render(<App />);

        // Verify "Loading..." appears initially
        expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();

        // Wait for the backend data to appear (indicating backend is UP)
        // If backend is DOWN, this will timeout and FAIL the test.
        await waitFor(() => {
            expect(screen.getByText(/Status:/i)).toBeInTheDocument();
            // We can also check for specific content if we know what the backend returns
            // but availability checking is the primary goal.
        }, { timeout: 5000 });
    });
});
