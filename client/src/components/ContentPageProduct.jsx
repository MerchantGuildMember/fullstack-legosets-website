import React, {useEffect, useState} from 'react'


export default function ContentPageProduct( {product}) {

    return (
        <div className="ProductModule">
            <img src={product.image} alt="product" />

            <div className="productInfo">
                <div className="productTitle">{product.name}</div>
                <div className="productCost">{product.price}</div>
            </div>
        </div>
    )
}
