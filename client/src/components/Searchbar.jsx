import React, {useState} from 'react';


export default function Searchbar( {search, setSearch} ) {

    return(
        <div className="Searchbar">
            <input className="navSearchBar"
                   value = {search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search..." />
        </div>
    )
}