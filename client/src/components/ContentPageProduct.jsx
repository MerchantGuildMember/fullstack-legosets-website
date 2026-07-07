import React from 'react'
import BuyButton from "./BuyButton";

export default function ContentPageProduct( {product, view, style} ) {

    if (view === 'basic') {
        const outOfStock = product.stock <= 0;

        return (
            <a className={`ProductModule${outOfStock ? ' outOfStock' : ''}`}
               href={`/product/${product._id}`}
               style={style}
            >
                <div className="productMedia">
                    <img
                        src={product.images?.[0]}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                    />
                    {outOfStock && <span className="stockBadge">Out of stock</span>}
                </div>

                <div className="productInfo">
                    {product.brand && <div className="productBrand">{product.brand}</div>}
                    <div className="productTitle">{product.name}</div>
                    <div className="productCost">&euro;{product.price.toFixed(2)}</div>
                </div>
            </a>
        )
    }
    else if (view === 'advanced') {
        return (
            <div className="ProductModule">
                <div className="productContent">

                    <div className="productMedia">
                        <img src={product.images[0]} alt={product.name} />
                        <div className="studStrip" aria-hidden="true" />
                    </div>

                    <div className="productInfo">
                        {product.brand && <div className="productEyebrow">{product.brand}</div>}
                        <h1 className="productTitle">{product.name}</h1>

                        <div className="priceTag">
                            <span className="priceTagValue">&euro;{product.price}</span>
                        </div>

                        <div className="specSheet">
                            {product.pieceCount != null && (
                                <div className="specCell">
                                    <span className="specValue">{product.pieceCount}</span>
                                    <span className="specLabel">Pieces</span>
                                </div>
                            )}
                            <div className="specCell">
                                <span className="specValue">{product.stock}</span>
                                <span className="specLabel">In stock</span>
                            </div>
                            {product.ratingCount != null && (
                                <div className="specCell">
                                    <span className="specValue">{product.ratingCount}</span>
                                    <span className="specLabel">Ratings</span>
                                </div>
                            )}
                        </div>

                        <div className="aboutProduct">
                            <p className="aboutLabel">About this set</p>
                            <p className="productDesc">{product.description}</p>
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