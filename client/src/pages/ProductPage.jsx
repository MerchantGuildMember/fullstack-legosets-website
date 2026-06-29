import React, {useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import ContentPageProduct from "../components/ContentPageProduct";
import axios from 'axios';
import {useParams} from "react-router-dom";

export default function ProductPage() {

    const { _id } = useParams();
    let [product, setProduct]= useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/products/${_id}`)
            .then(r => {
                setProduct(r.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="ProductPage">
            <NavBar />
            <hr />
            {product && <ContentPageProduct product={product} view={'advanced'}/>}
        </div>
    )
}

