"use client";

import React, { useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import { bikes } from "@/assets/bikes";
import Card from "../components/Card/Card";
import { useSearchParams } from "next/navigation";
import FilterMenu from "../components/FilterMenu/FilterMenu";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../shadcnui/components/ui/resizable";
import { useFilterMenuContext } from "../context/FilterMenuContext";
import { IBike } from "@/utils/types/IBike";
import { IRating } from "@/utils/types/IRating";

export default function BikesPage() {
    const [selectedBikes, setSelectedBikes] = useState<IBike[]>(bikes);
    const { priceRange, search } = useFilterMenuContext();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState<boolean>(true);

    async function getAvgBikeRatings(array: IBike[]) {
        const newArray: { id: number; avgRating: number }[] = [];
        for (let i = 0; i < array.length; i++) {
            try {
                const res = await fetch(
                    `/api/bike/rating/get/by-id/?search-for=${array[i].id}`
                );
                const json: { userbikeRatings: IRating[] } = await res.json();
                const userbikeRatings = json.userbikeRatings;
                const initialValue = 0;
                const lenght = userbikeRatings.length;
                newArray.push({
                    id: array[i].id,
                    avgRating: userbikeRatings.reduce(
                        (a, b) => (a + b.rating) / lenght,
                        initialValue
                    ),
                });
            } catch (error) {
                throw new Error();
            }
        }

        return newArray.sort((a, b) => b.avgRating - a.avgRating);
    }
    async function getSelectedBikes() {
        setLoading(true);
        const url = window.location.search;
        const filter = url && url.replace("?filter-by=", "");
        var filteredBikes: IBike[] = [];
        const avgBikesRatings = await getAvgBikeRatings(bikes);

        // Number of recommended bikes
        var recommendedBikesNumber = avgBikesRatings.filter(
            (item) => item.avgRating >= 4
        ).length;

        if (recommendedBikesNumber > 3) {
            recommendedBikesNumber = 3;
        }

        const recommendedBikes = avgBikesRatings.slice(
            0,
            recommendedBikesNumber
        );
        const normalBikes = avgBikesRatings.slice(recommendedBikesNumber);
        const recommendedIndexArr = recommendedBikes.map((item) => item.id);

        for (let i = 0; i < bikes.length; i++) {
            if (recommendedIndexArr.includes(bikes[i].id)) {
                const bikeIndex = recommendedBikes.findIndex(
                    (item) => item.id === bikes[i].id
                );
                // Defining the 'recommended' an 'rating' keys on the LOCAL variable
                filteredBikes.push({
                    ...bikes[i],
                    rating: recommendedBikes[bikeIndex].avgRating || 0,
                    recommended: true,
                });
                // Defining the 'recommended' an 'rating' keys on the GLOBAL variable
                Object.assign(bikes[i], {
                    recommended: true,
                    rating: recommendedBikes[bikeIndex].avgRating || 0,
                });
            } else {
                const bikeIndex = normalBikes.findIndex(
                    (item) => item.id === bikes[i].id
                );
                filteredBikes.push({
                    ...bikes[i],
                    rating: normalBikes[bikeIndex].avgRating || 0,
                    recommended: false,
                });
                Object.assign(bikes[i], {
                    recommended: false,
                    rating: normalBikes[bikeIndex].avgRating || 0,
                });
            }
        }

        if (filter && filter !== "all") {
            if (filter === "recommended") {
                filteredBikes = filteredBikes.filter(
                    (item) => item.recommended === true
                );
            } else {
                filteredBikes = filteredBikes.filter(
                    (item) => item.category.toLowerCase() === filter
                );
            }
        } else {
            filteredBikes = filteredBikes;
        }
        filteredBikes = filteredBikes.filter(
            (bikes) => bikes.price <= priceRange
        );
        if (search) {
            filteredBikes = filteredBikes.filter((bike) =>
                bike.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        setLoading(false);
        setSelectedBikes(filteredBikes);
    }

    useEffect(() => {
        document.title = "Bike4Cash | Our Bikes";
        getSelectedBikes();
    }, [searchParams, priceRange, search]);

    if (loading) {
        return (
            <div className="scale-[0.3] h-[25vh]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle
                        fill="#22C55E"
                        stroke="#22C55E"
                        strokeWidth="9"
                        r="3"
                        cx="75"
                        cy="135"
                    >
                        <animate
                            attributeName="cy"
                            calcMode="spline"
                            dur="1.5"
                            values="135;100;135;"
                            keySplines=".5 0 .5 1;.5 0 .5 1"
                            repeatCount="indefinite"
                            begin="-.4"
                        ></animate>
                    </circle>
                    <circle
                        fill="#22C55E"
                        stroke="#22C55E"
                        strokeWidth="9"
                        r="3"
                        cx="100"
                        cy="135"
                    >
                        <animate
                            attributeName="cy"
                            calcMode="spline"
                            dur="1.5"
                            values="135;100;135;"
                            keySplines=".5 0 .5 1;.5 0 .5 1"
                            repeatCount="indefinite"
                            begin="-.2"
                        ></animate>
                    </circle>
                    <circle
                        fill="#22C55E"
                        stroke="#22C55E"
                        strokeWidth="9"
                        r="3"
                        cx="125"
                        cy="135"
                    >
                        <animate
                            attributeName="cy"
                            calcMode="spline"
                            dur="1.5"
                            values="135;100;135;"
                            keySplines=".5 0 .5 1;.5 0 .5 1"
                            repeatCount="indefinite"
                            begin="0"
                        ></animate>
                    </circle>
                </svg>
            </div>
        );
    }

    return (
        <div>
            <Banner
                height="50vh"
                src="bikes-page-banner.jpg"
                alt="Bikes page banner"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-white text">
                    Our <span className="text-green-500">bikes</span>{" "}
                </h1>
            </Banner>
            <ResizablePanelGroup
                direction="horizontal"
                className="px-8 pr-0 w-screen relative z-[5]"
            >
                <ResizablePanel>
                    <div className="flex flex-wrap justify-center pt-8 pb-16 gap-4 min-w-[80vw] w-full">
                        {selectedBikes.map((bike, index) => (
                            <Card bike={bike} key={index} />
                        ))}
                    </div>
                </ResizablePanel>
                <ResizableHandle
                    withHandle
                    className="bg-green-500 z-20 w-[2px]"
                />
                <ResizablePanel defaultSize={15} className="bg-white">
                    <div className="absolute w-[4vw] h-full top-0 right-0 bg-gradient-to-r from-transparent to-white z-10"></div>
                    <FilterMenu />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
