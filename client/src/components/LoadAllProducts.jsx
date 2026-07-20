import React, {useEffect, useRef, useState} from 'react';
import ContentPageProduct from "./ContentPageProduct";
import axios from 'axios';

const PAGE_SIZE = 24;

export default function LoadAllProducts(props) {

    const search = props.search;
    const cleanSearch = search.replace(/[^a-zA-Z0-9]/g, "");

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const sentinelRef = useRef(null);
    const loadingRef = useRef(false);
    const prevSearchRef = useRef(cleanSearch);

    useEffect(() => { loadingRef.current = loading; }, [loading]);

    useEffect(() => {
        const searchChanged = prevSearchRef.current !== cleanSearch;
        prevSearchRef.current = cleanSearch;

        if (searchChanged && page !== 0) {
            setPage(0);
            return;
        }

        let cancelled = false;
        if (searchChanged) {
            setProducts([]);
            setHasMore(true);
        }

        const url = cleanSearch === ""
            ? `http://localhost:5000/products?page=${page}&limit=${PAGE_SIZE}`
            : `http://localhost:5000/products/search/${cleanSearch}?page=${page}&limit=${PAGE_SIZE}`;

        setLoading(true);

        axios.get(url)
            .then(res => {
                if (cancelled) return;
                const { products: newProducts, hasMore: more } = res.data;
                setProducts(prev => page === 0 ? newProducts : [...prev, ...newProducts]);
                setHasMore(more);
            })
            .catch(err => console.error("Failed to load products:", err))
            .finally(() => !cancelled && setLoading(false));

        return () => { cancelled = true; };
    }, [cleanSearch, page]);

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
        <div className="ProductListWrapper">
            <div className="ProductList">
                {products.map((product, i) => (
                    <ContentPageProduct
                        key={product._id}
                        product={product}
                        view={'basic'}
                        style={{ '--i': i % PAGE_SIZE }}
                    />
                ))}
            </div>

            {hasMore && <div className="scrollSentinel" ref={sentinelRef} />}
            {loading && <div className="productListStatus">Loading more…</div>}
            {!hasMore && products.length > 0 && (
                <div className="productListStatus">You've reached the end of the catalog.</div>
            )}
        </div>
    )
}