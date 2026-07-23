import React, {useEffect, useRef, useState} from 'react';
import ContentPageProduct from "./ContentPageProduct";
import axios from 'axios';

const PAGE_SIZE = 24;

function buildQuery(page, sort, filters) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', PAGE_SIZE);

    if (sort && sort !== 'relevance') params.set('sort', sort);
    if (filters.brand && filters.brand.length) params.set('brand', filters.brand.join(','));
    if (filters.minPrice !== '' && filters.minPrice != null) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== '' && filters.maxPrice != null) params.set('maxPrice', filters.maxPrice);
    if (filters.inStock) params.set('inStock', 'true');

    return params.toString();
}

export default function LoadAllProducts(props) {

    const search = props.search;
    const sort = props.sort || 'relevance';
    const filters = props.filters || {};
    const cleanSearch = search.replace(/[^a-zA-Z0-9]/g, "");
    const filtersKey = JSON.stringify(filters);

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const sentinelRef = useRef(null);
    const loadingRef = useRef(false);
    const prevQueryRef = useRef({ cleanSearch, sort, filtersKey });

    useEffect(() => { loadingRef.current = loading; }, [loading]);

    useEffect(() => {
        const prev = prevQueryRef.current;
        const queryChanged = prev.cleanSearch !== cleanSearch || prev.sort !== sort || prev.filtersKey !== filtersKey;
        prevQueryRef.current = { cleanSearch, sort, filtersKey };

        if (queryChanged && page !== 0) {
            setPage(0);
            return;
        }

        let cancelled = false;
        if (queryChanged) {
            setProducts([]);
            setHasMore(true);
        }

        const queryString = buildQuery(page, sort, filters);
        const url = cleanSearch === ""
            ? `http://localhost:5000/products?${queryString}`
            : `http://localhost:5000/products/search/${cleanSearch}?${queryString}`;

        setLoading(true);

        axios.get(url)
            .then(res => {
                if (cancelled) return;
                const { products: newProducts, hasMore: more } = res.data || {};
                if (!Array.isArray(newProducts)) {
                    console.error("Unexpected /products response shape:", res.data);
                    setProducts(prev => page === 0 ? [] : prev);
                    setHasMore(false);
                    return;
                }
                setProducts(prev => page === 0 ? newProducts : [...prev, ...newProducts]);
                setHasMore(!!more);
            })
            .catch(err => console.error("Failed to load products:", err))
            .finally(() => !cancelled && setLoading(false));

        return () => { cancelled = true; };
    }, [cleanSearch, sort, filtersKey, page]);

    useEffect(() => {
        const node = sentinelRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore && !loadingRef.current) {
                setPage(prev => prev + 1);
            }
        }, { rootMargin: "600px 0px" });

        observer.observe(node);
        return () => observer.disconnect();
    }, [hasMore]);

    return (
        <div className="ac_productListWrapper">
            <div className="ac_productList">
                {products.map((product, i) => (
                    <ContentPageProduct
                        key={product._id}
                        product={product}
                        view={'basic'}
                        style={{ '--i': i % PAGE_SIZE }}
                    />
                ))}
            </div>

            {hasMore && <div className="ac_scrollSentinel" ref={sentinelRef} />}
            {loading && <div className="ac_productListStatus">Loading more…</div>}
            {!hasMore && products.length > 0 && (
                <div className="ac_productListStatus">You've reached the end of the catalog.</div>
            )}
            {!hasMore && !loading && products.length === 0 && (
                <div className="ac_productListStatus">No products match your filters.</div>
            )}
        </div>
    )
}