import React from 'react';

export default function Scroller() {
    const diamonds = Array.from({ length: 15 });

    return (
        <div className="ac_scrollerWrapper">
            {diamonds.map((_, i) => (
                <div className="ac_diamond" key={i}></div>
            ))}
        </div>
    );
}