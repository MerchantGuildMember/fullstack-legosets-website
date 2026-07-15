import {React, useEffect, useState} from "react";

export default function useCountdown(active, seconds) {
    const [remaining, setRemaining] = useState(seconds);
    useEffect(() => {
        if (!active) {
            setRemaining(seconds);
            return;
        }
        if (remaining <= 0) return;
        const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
        return () => clearTimeout(t);
    }, [active, remaining, seconds]);
    return remaining;
}