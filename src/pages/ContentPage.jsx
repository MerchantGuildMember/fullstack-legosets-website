import React from 'react';
import NavBar from '../components/NavBar';
import Searchbar from "../components/Searchbar";

export default function ContentPage() {
    return (
        <div className="ContentPage">
            <NavBar />
            <p>ContentPage</p>
            <Searchbar />
        </div>
    )
}
