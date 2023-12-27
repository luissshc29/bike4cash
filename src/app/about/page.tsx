import React from "react";
import Banner from "../components/Banner/Banner";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bike4Cash | About us",
};

export default function AboutPage() {
    return (
        <div>
            <Banner
                height="50vh"
                src="about-us-page-banner.jpg"
                alt="About us page image"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-white text">
                    About <span className="text-green-500">us</span>{" "}
                </h1>
            </Banner>
            <div className="p-12 pb-16 md:px-16 flex flex-col gap-6 items-center text-sm md:text-lg">
                <p>
                    Welcome to{" "}
                    <span className="text-green-500 font-semibold">
                        Bike4Cash
                    </span>
                    , where your <u>cycling adventure</u> begins! At{" "}
                    <span className="text-green-500 font-semibold">
                        Bike4Cash
                    </span>
                    , we're passionate about providing you with top-quality
                    bicycles to elevate your riding experience. Whether you're
                    an <u>avid cyclist</u> seeking thrilling mountain trails or
                    a <u>casual rider</u> exploring the city, our diverse fleet
                    of bikes caters to every need.
                </p>

                <p>
                    We pride ourselves on offering an extensive selection of
                    meticulously maintained bikes, ensuring your <u>safety</u>{" "}
                    and <u>comfort</u> on every journey. Our user-friendly
                    rental process allows you to easily browse, select, and rent
                    your ideal bike, offering flexible rental durations to suit
                    your schedule.
                </p>

                <p>
                    At{" "}
                    <span className="text-green-500 font-semibold">
                        Bike4Cash
                    </span>
                    , we prioritize customer satisfaction, aiming to exceed your
                    expectations with our exceptional service and commitment to
                    delivering <u>top-notch equipment</u>. Our knowledgeable
                    team stands ready to assist you in choosing the perfect bike
                    and providing valuable insights into the best biking routes
                    and experiences in your chosen destination.
                </p>

                <p>
                    Join us at{" "}
                    <span className="text-green-500 font-semibold">
                        Bike4Cash
                    </span>
                    , where we combine our <u>love for cycling</u> with a
                    seamless renting experience, empowering you to{" "}
                    <u>explore the world</u> on two wheels with confidence and
                    joy.
                </p>
            </div>
        </div>
    );
}
