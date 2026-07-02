import React, {useEffect, useState} from 'react';
import ContentPageProduct from "./ContentPageProduct";
import axios from 'axios';


export default function LoadAllProducts(props) {

    const [products, setProducts] = useState([]);

    const search = props.search

    const cleanSearch = search.replace(/[^a-zA-Z0-9]/g, "");

    useEffect(() => {

        if (cleanSearch === "") {
            axios.get("http://localhost:5000/products")
                .then(res => setProducts(res.data));
        } else {
            axios.get(`http://localhost:5000/products/search/${cleanSearch}`)
                .then(res => setProducts(res.data));
        }

    }, [search]);

    return(
        <div className="ProductList">
        {products.map(product => (
                <ContentPageProduct
                    key={product._id}
                    product={product}
                    view={'basic'}
                />
            ))}
        </div>
    )
}