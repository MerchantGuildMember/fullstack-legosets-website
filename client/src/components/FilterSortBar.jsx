import React, {useEffect, useState} from 'react';
import axios from 'axios';

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest arrivals' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
    { value: 'popular', label: 'Most rated' },
];

export default function FilterSortBar({ sort, setSort, filters, setFilters }) {

    const [brands, setBrands] = useState([]);
    const [priceDraft, setPriceDraft] = useState({
        minPrice: filters.minPrice ?? '',
        maxPrice: filters.maxPrice ?? '',
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/products/brands')
            .then(res => setBrands(res.data.brands || []))
            .catch(err => console.error('Failed to load brands:', err));
    }, []);

    const toggleBrand = (brand) => {
        setFilters(prev => {
            const current = prev.brand || [];
            const next = current.includes(brand)
                ? current.filter(b => b !== brand)
                : [...current, brand];
            return { ...prev, brand: next };
        });
    };

    const applyPriceRange = () => {
        setFilters(prev => ({
            ...prev,
            minPrice: priceDraft.minPrice,
            maxPrice: priceDraft.maxPrice,
        }));
    };

    const toggleInStock = () => {
        setFilters(prev => ({ ...prev, inStock: !prev.inStock }));
    };

    const clearAll = () => {
        setSort('relevance');
        setPriceDraft({ minPrice: '', maxPrice: '' });
        setFilters({ brand: [], minPrice: '', maxPrice: '', inStock: false });
    };

    const activeCount =
        (filters.brand?.length || 0) +
        (filters.minPrice ? 1 : 0) +
        (filters.maxPrice ? 1 : 0) +
        (filters.inStock ? 1 : 0);

    return (
        <div className="ac_filterSortBar">
            <div className="ac_filterSortRow">
                <button
                    type="button"
                    className="ac_filterToggle"
                    onClick={() => setOpen(prev => !prev)}
                >
                    Filters{activeCount > 0 ? ` (${activeCount})` : ''}
                </button>

                <label className="ac_sortSelectWrapper">
                    <span>Sort by</span>
                    <select
                        className="ac_sortSelect"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        {SORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </label>

                {activeCount > 0 && (
                    <button type="button" className="ac_clearFilters" onClick={clearAll}>
                        Clear all
                    </button>
                )}
            </div>

            {open && (
                <div className="ac_filterPanel">
                    <div className="ac_filterGroup">
                        <h3>Brand</h3>
                        <div className="ac_filterBrandList">
                            {brands.map(brand => (
                                <label key={brand} className="ac_filterCheckbox">
                                    <input
                                        type="checkbox"
                                        checked={filters.brand?.includes(brand) || false}
                                        onChange={() => toggleBrand(brand)}
                                    />
                                    {brand}
                                </label>
                            ))}
                            {brands.length === 0 && <span className="ac_filterEmpty">No brands found</span>}
                        </div>
                    </div>

                    <div className="ac_filterGroup">
                        <h3>Price (&euro;)</h3>
                        <div className="ac_filterPriceRange">
                            <input
                                type="number"
                                min="0"
                                placeholder="Min"
                                value={priceDraft.minPrice}
                                onChange={(e) => setPriceDraft(prev => ({ ...prev, minPrice: e.target.value }))}
                                onBlur={applyPriceRange}
                                onKeyDown={(e) => e.key === 'Enter' && applyPriceRange()}
                            />
                            <span>&ndash;</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="Max"
                                value={priceDraft.maxPrice}
                                onChange={(e) => setPriceDraft(prev => ({ ...prev, maxPrice: e.target.value }))}
                                onBlur={applyPriceRange}
                                onKeyDown={(e) => e.key === 'Enter' && applyPriceRange()}
                            />
                        </div>
                    </div>

                    <div className="ac_filterGroup">
                        <h3>Availability</h3>
                        <label className="ac_filterCheckbox">
                            <input
                                type="checkbox"
                                checked={!!filters.inStock}
                                onChange={toggleInStock}
                            />
                            In stock only
                        </label>
                    </div>
                </div>
            )}
        </div>
    )
}