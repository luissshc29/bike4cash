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
      height={"80vh"}
      src={`home-page-banner.jpg`}
      alt="Cycling image"
      className="min-w-[1024px]"
    >
      <h1 className="font-bold text-3xl text-white md:text-4xl">
        The <span className="text-4xl text-green-500 md:text-5xl">#1</span> bike
        rental web service!
      </h1>
      <p className="font-light text-sm text-white md:text-md">
        We're ready to accompany you on all your journeys!
      </p>
      <Button href="/bikes/?category=all" link={true}>
        Rent now
      </Button>
    </Banner>
  );
}
