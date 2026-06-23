import React from 'react';

function randomPhrase() {
    let potentialPhrases = [
        'What Lego are we getting today?',
        'Top Quality Legos',
        'Best Legos in Leinster'
    ]
    let phrase = Math.floor(Math.random() * potentialPhrases.length);
    return potentialPhrases[phrase];
}

export default function Eggon() {

    return (
        <div className="eggon">
            <p>{randomPhrase()}</p>
        </div>
    )
}