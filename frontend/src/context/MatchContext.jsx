import React, { createContext, useContext, useState } from 'react';

const MatchContext = createContext();

export const useMatch = () => useContext(MatchContext);

export const MatchProvider = ({ children }) => {
    const [currentMatch, setCurrentMatch] = useState(null);

    const setMatch = (match) => {
        const safeMatch = {
            ...match,
            matchBetmates: match.matchBetmates || [], 
        };
        console.log("Setting current match:", safeMatch);
        setCurrentMatch(safeMatch);
    };

    return (
        <MatchContext.Provider value={{ currentMatch, setMatch }}>
            {children}
        </MatchContext.Provider>
    );
};
