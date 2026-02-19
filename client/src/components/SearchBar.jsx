import React, { useState } from 'react';

function SearchBar({ onSearch }) {
    const [term, setTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(term);
    };

    const handleClear = () => {
        setTerm('');
        onSearch('');
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit} role="search">
            <input
                type="search"
                placeholder="Search products..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                aria-label="Search products"
            />
            <button type="submit">Search</button>
            {term && <button type="button" onClick={handleClear} aria-label="Clear search">Clear</button>}
        </form>
    );
}

export default SearchBar;
