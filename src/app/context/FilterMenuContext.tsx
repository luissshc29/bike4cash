"use client";

import React, { createContext, useContext, useState } from "react";

const FilterMenuContext = createContext<any>(200);

export default function FilterMenuProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [priceRange, setPriceRange] = useState<number>(250);
    const [search, setSearch] = useState<string>("");
    return (
        <FilterMenuContext.Provider
            value={{ priceRange, setPriceRange, search, setSearch }}
        >
            {children}
        </FilterMenuContext.Provider>
    );
}

type FilterMenuContextType = {
    priceRange: number;
    setPriceRange: React.Dispatch<React.SetStateAction<number>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export function useFilterMenuContext() {
    const { priceRange, setPriceRange, search, setSearch } =
        useContext<FilterMenuContextType>(FilterMenuContext);

    return {
        priceRange,
        setPriceRange,
        search,
        setSearch,
    };
}
