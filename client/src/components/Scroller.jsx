import React from 'react';

export default function Scroller() {
    const diamonds = Array.from({ length: 15 });

    return (
        <div className="ScrollerWrapper">
            {diamonds.map((_, i) => (
                <div className="diamond" key={i}></div>
            ))}
        </div>
    );
}