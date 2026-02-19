import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
    it('renders input and search button', () => {
        render(<SearchBar onSearch={() => { }} />);
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('updates input value on change', () => {
        render(<SearchBar onSearch={() => { }} />);
        const input = screen.getByPlaceholderText(/search/i);

        fireEvent.change(input, { target: { value: 'phone' } });
        expect(input.value).toBe('phone');
    });

    it('calls onSearch with term when form submitted', () => {
        const handleSearch = vi.fn();
        render(<SearchBar onSearch={handleSearch} />);

        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: 'laptop' } });

        const form = screen.getByRole('search'); // using aria-label role
        fireEvent.submit(form);

        expect(handleSearch).toHaveBeenCalledWith('laptop');
    });

    it('shows clear button when input has text', () => {
        render(<SearchBar onSearch={() => { }} />);
        const input = screen.getByPlaceholderText(/search/i);

        // initially no clear button
        expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'test' } });
        // now clear button should appear
        expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('clears input and calls onSearch with empty string when cleared', () => {
        const handleSearch = vi.fn();
        render(<SearchBar onSearch={handleSearch} />);

        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: 'test' } });

        const clearBtn = screen.getByRole('button', { name: /clear/i });
        fireEvent.click(clearBtn);

        expect(input.value).toBe('');
        expect(handleSearch).toHaveBeenCalledWith('');
    });
});
