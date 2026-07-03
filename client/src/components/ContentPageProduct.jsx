import React, {useEffect, useState} from 'react'
import BuyButton from "./BuyButton";

export default function ContentPageProduct( {product, view, style} ) {

    if (view === 'basic') {
        return (
            <a className="ProductModule" href={`/product/${product._id}`} style={style} >
                <img src={product.image} alt="" />

                <div className="productInfo">
                    <div className="productCost">&euro;{product.price}</div>
                    <div className="productTitle">{product.name}</div>
                </div>
            </a>
        )
    }
    else if (view === 'advanced') {
        console.log(product.image);

        return (
            <div className="ProductModule">
                <div className="productContent">
                    <img src={product.image} alt="" />
                    <div className="productInfo">
                        <div className="productTitle">{product.name}</div>
                        <div className="productCost">&euro;{product.price}</div>

                        <div className="aboutProduct">
                            <p>vv About this item vv</p>
                            <div className="productDesc">{product.description}</div>
                        </div>
                        <div className="productStock">{product.stock} pcs in stock</div>
                        <BuyButton/>
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
