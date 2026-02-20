import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, filterByCategory, getStockLabel } from './utils';

describe('Utility Functions', () => {
    describe('formatPrice', () => {
        it('formats cents to dollars', () => {
            expect(formatPrice(1299)).toBe('$12.99');
            expect(formatPrice(50)).toBe('$0.50');
            expect(formatPrice(0)).toBe('$0.00');
        });

        it('handles invalid inputs gracefully', () => {
            expect(formatPrice(null)).toBe('$0.00');
            expect(formatPrice(undefined)).toBe('$0.00');
            expect(formatPrice('abc')).toBe('$0.00');
        });
    });

    describe('formatDate', () => {
        it('formats valid iso string', () => {
            const date = '2023-01-15T00:00:00.000Z';
            expect(formatDate(date)).toContain('January 15, 2023');
        });

        it('handles invalid inputs', () => {
            expect(formatDate(null)).toBe('Unknown Date');
        });
    });

    describe('filterByCategory', () => {
        const products = [
            { id: 1, category: 'Tech' },
            { id: 2, category: 'Clothing' },
            { id: 3, category: 'Tech' }
        ];

        it('filters by category case-insensitive', () => {
            const result = filterByCategory(products, 'tech');
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(1);
        });

        it('returns all if no category provided', () => {
            expect(filterByCategory(products, '')).toHaveLength(3);
        });

        it('returns empty array for invalid input', () => {
            expect(filterByCategory(null, 'tech')).toEqual([]);
        });
    });

    describe('getStockLabel', () => {
        it('returns correct label', () => {
            expect(getStockLabel(true)).toBe('In Stock');
            expect(getStockLabel(false)).toBe('Out of Stock');
        });
    });
});
