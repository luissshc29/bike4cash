import React from "react";
import Banner from "../components/Banner/Banner";
import { Metadata } from "next";
import { bikes } from "@/assets/bikes";
import Card from "../components/Card/Card";

export const metadata: Metadata = {
    title: "Bike4Cash | Our Bikes",
};

export default function BikesPage() {
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
            <div className="flex flex-wrap justify-evenly pt-8 pb-16">
                {bikes.map((bike) => (
                    <Card bike={bike} key={bike.id} />
                ))}
            </div>
        </div>
    );
}
