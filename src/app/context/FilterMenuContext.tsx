"use client";

import React, { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

const FilterMenuContext = createContext<any>(200);

export default function FilterMenuProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [priceRange, setPriceRange] = useState(250);
    const [search, setSearch] = useState("");
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
    setPriceRange: Dispatch<SetStateAction<number>>;
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
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
