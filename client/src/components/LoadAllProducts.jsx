import React, {useEffect, useState} from 'react';
import ContentPageProduct from "./ContentPageProduct";
import axios from 'axios';


export default function LoadAllProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/products`)
            .then((response) => {
                setProducts(response.data);
            })

    }, []);
    return(
        <div className="ProductList">
        {products.map(product => (
                <ContentPageProduct
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    )
}