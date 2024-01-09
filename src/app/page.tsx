import { Metadata } from "next";
import Link from "next/link";
import Banner from "./components/Banner/Banner";
import Button from "./components/Button/Button";

export const metadata: Metadata = {
    title: "Bike4Cash | Home",
};

export default function Home() {
    return (
        <Banner
            height={"100vh"}
            src={`home-page-banner.jpg`}
            alt="Cycling image"
            className="min-w-[1024px]"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-white">
                The{" "}
                <span className="text-green-500 text-4xl md:text-5xl">#1</span>{" "}
                bike rental web service!
            </h1>
            <p className="text-sm md:text-md text-white font-light">
                We're ready to accompany you on all your journeys!
            </p>
            <Button href="/bikes/?filter-by=all" link={true}>
                Rent now
            </Button>
        </Banner>
    );
}
