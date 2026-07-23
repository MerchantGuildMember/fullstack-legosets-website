import React, {useState} from 'react';
import NavBar from '../components/NavBar';
import Searchbar from "../components/Searchbar";
import LoadAllProducts from "../components/LoadAllProducts";
import FilterSortBar from "../components/FilterSortBar";
import Eggon from "../components/Eggon";

export default function ContentPage( {isLoggedIn, setIsLoggedIn} ) {

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("relevance");
    const [filters, setFilters] = useState({
        brand: [],
        minPrice: "",
        maxPrice: "",
        inStock: false,
    });

    return (
        <div className="ac_contentPage">
            <NavBar
                search={search}
                setSearch={setSearch}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
            />
            <Eggon />
            <FilterSortBar
                sort={sort}
                setSort={setSort}
                filters={filters}
                setFilters={setFilters}
            />
            <LoadAllProducts
                search={search}
                sort={sort}
                filters={filters}
            />
        </div>
    )
}