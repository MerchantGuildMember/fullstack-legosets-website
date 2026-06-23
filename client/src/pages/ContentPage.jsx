import React from 'react';
import NavBar from '../components/NavBar';
import Searchbar from "../components/Searchbar";
import LoadAllProducts from "../components/LoadAllProducts";
import Eggon from "../components/Eggon";

export default function ContentPage() {
    return (
        <div className="ContentPage">
            <NavBar />
            <hr/>
            <Eggon />
            <Searchbar />
            <LoadAllProducts />
        </div>
    )
}
