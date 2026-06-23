import React, {useEffect, useState} from 'react'


export default function ContentPageProduct( {product}) {

    return (
        <a className="ProductModule" href={`/product/${product.id}`}>
            <img src={product.image} alt="product" />

            <div className="productInfo">
                <div className="productTitle">{product.name}</div>
                <div className="productCost">{product.price}</div>
            </div>
        </a>
    )
}
