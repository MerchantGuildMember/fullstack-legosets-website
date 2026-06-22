import React from 'react';

export default function Searchbar(props) {
    return(
        <div className="Searchbar">
            <input onChange={props.onChange} placeholder="Search..." />
        </div>
    )
}