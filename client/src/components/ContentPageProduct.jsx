import React from 'react'
import BuyButton from "./BuyButton";

export default function ContentPageProduct( {product, view, style} ) {

    if (view === 'basic') {
        const outOfStock = product.stock <= 0;

        return (
            <a className={`ac_productModule${outOfStock ? ' outOfStock' : ''}`}
               href={`/product/${product._id}`}
               style={style}
            >
                <div className="ac_productMedia">
                    <img
                        src={product.images?.[0]}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                            if (e.target.dataset.fallback) return;
                            e.target.dataset.fallback = 'true';
                            e.target.src = '/placeholder-product.png';
                        }}
                    />
                    {outOfStock && <span className="ac_stockBadge">Out of stock</span>}
                </div>

                <div className="ac_productInfo">
                    {product.brand && <div className="ac_productBrand">{product.brand}</div>}
                    <div className="ac_productTitle">{product.name}</div>
                    <div className="ac_productCost">&euro;{product.price.toFixed(2)}</div>
                </div>
            </a>
        )
    }
    else if (view === 'advanced') {
        return (
            <div className="ac_productModule">
                <div className="ac_productContent">

                    <div className="ac_productMedia">
                        <img src={product.images[0]} alt={product.name} />
                        <div className="ac_studStrip" aria-hidden="true" />
                    </div>

                    <div className="ac_productInfo">
                        {product.brand && <div className="ac_productEyebrow">{product.brand}</div>}
                        <h1 className="ac_productTitle">{product.name}</h1>

                        <div className="ac_priceTag">
                            <span className="ac_priceTagValue">&euro;{product.price}</span>
                        </div>

                        <div className="ac_specSheet">
                            {product.pieceCount != null && (
                                <div className="ac_specCell">
                                    <span className="ac_specValue">{product.pieceCount}</span>
                                    <span className="ac_specLabel">Pieces</span>
                                </div>
                            )}
                            <div className="ac_specCell">
                                <span className="ac_specValue">{product.stock}</span>
                                <span className="ac_specLabel">In stock</span>
                            </div>
                            {product.ratingCount != null && (
                                <div className="ac_specCell">
                                    <span className="ac_specValue">{product.ratingCount}</span>
                                    <span className="ac_specLabel">Ratings</span>
                                </div>
                            )}
                        </div>

                        <div className="ac_aboutProduct">
                            <p className="ac_aboutLabel">About this set</p>
                            <p className="ac_productDesc">{product.description}</p>
                        </div>

                        <BuyButton product={product} />
                    </div>

                </div>
            </div>
        )
    }
    else {
        return (
            <p>null</p>
        )
    }
}