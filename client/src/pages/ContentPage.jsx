import React, {useState} from 'react';
import NavBar from '../components/NavBar';
import Searchbar from "../components/Searchbar";
import LoadAllProducts from "../components/LoadAllProducts";
import Eggon from "../components/Eggon";

export default function ContentPage( {isLoggedIn, setIsLoggedIn} ) {

    const [search, setSearch] = useState("");

    return (
        <div className="ContentPage">
            <NavBar
                search={search}
                setSearch={setSearch}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
            />
            <Eggon />
            <LoadAllProducts
                search={search}
            />
        </div>
    )
}
