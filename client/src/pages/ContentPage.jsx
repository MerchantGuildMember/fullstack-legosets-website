import React from 'react';
import NavBar from '../components/NavBar';
import Searchbar from "../components/Searchbar";
import LoadAllProducts from "../components/LoadAllProducts";

export default function ContentPage() {
    return (
        <div className="ContentPage">
            <NavBar />
            <Searchbar />
            <LoadAllProducts />
        </div>
    )
}
