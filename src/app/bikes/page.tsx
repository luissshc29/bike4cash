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
import { GoPlus } from "react-icons/go";
import { MdOutlineDirectionsBike } from "react-icons/md";
import { getUserData } from "@/utils/functions/user";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "../shadcnui/components/ui/dialog";
import { Input } from "../shadcnui/components/ui/input";
import Button from "../components/Button/Button";
import LoadingSVG from "@/utils/svg/LoadingSVG";

export default function BikesPage() {
  const [selectedBikes, setSelectedBikes] = useState<IBike[]>(bikes);
  const { priceRange, search } = useFilterMenuContext();
  const searchParams = useSearchParams();
  const session = useSession();

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
        const lenght = userbikeRatings.length;
        const initialValue = userbikeRatings[0].rating;
        const individualAvgRating = userbikeRatings.reduce(
          (a, b) => (a + b.rating) / lenght,
          initialValue
        );
        newArray.push({
          id: array[i].id,
          avgRating: individualAvgRating > 5 ? 5 : individualAvgRating,
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

    const recommendedBikes = avgBikesRatings.slice(0, recommendedBikesNumber);
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
    filteredBikes = filteredBikes.filter((bikes) => bikes.price <= priceRange);
    if (search) {
      filteredBikes = filteredBikes.filter((bike) =>
        bike.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setSelectedBikes(filteredBikes);
    getUser();
  }

  const [username, setUsername] = useState<string>("");
  async function getUser() {
    if (session.status === "authenticated") {
      try {
        const username = (await getUserData(session)).username;
        setUsername(username);
        setLoading(false);
      } catch (error) {
        console.log("Couldn't obtain username");
      }
    } else {
      setLoading(false);
    }
  }

  const [bikeAditionError, setBikeAditionError] = useState<string>("");

  const addBike = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputArray = Array.from(e.currentTarget.elements);
    const bikeId = Number(
      (inputArray.find((item) => item.id === "bikeId") as HTMLInputElement)
        .value
    );
    const bikeCategory = (
      inputArray.find((item) => item.id === "bikeCategory") as HTMLInputElement
    ).value;
    const bikeName = (
      inputArray.find((item) => item.id === "bikeName") as HTMLInputElement
    ).value;
    const bikePrice = Number(
      (inputArray.find((item) => item.id === "bikePrice") as HTMLInputElement)
        .value
    );
    console.log(bikeId, bikeCategory, bikeName, bikePrice);
  };

  useEffect(() => {
    document.title = "Bike4Cash | Our Bikes";
    getSelectedBikes();
  }, [session.status, searchParams, priceRange, search]);

  if (loading) {
    return (
      <div className="h-[20vh] scale-[0.3]">
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
        <h2 className="font-semibold text-center text-green-500 text-xl scale-[2.5]">
          Gathering our bikes details...
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Banner height="50vh" src="bikes-page-banner.jpg" alt="Bikes page banner">
        <h1 className="font-bold text-3xl text-white md:text-4xl text">
          Our <span className="text-green-500">bikes</span>{" "}
        </h1>
      </Banner>
      <ResizablePanelGroup
        direction="horizontal"
        className="relative z-[5] px-8 pr-0 w-screen"
      >
        <ResizablePanel>
          <div className="flex flex-wrap justify-center gap-4 pt-8 pb-16 w-full min-w-[80vw]">
            {selectedBikes.map((bike, index) => (
              <Card bike={bike} key={index} />
            ))}
            {username === "luis_admin" && (
              <Dialog
                onOpenChange={() => {
                  // reset();
                }}
              >
                <DialogTrigger asChild>
                  <div className="relative flex flex-wrap justify-center items-center gap-2 border-[3px] border-neutral-200 shadow-md shadow-neutral-300 p-4 w-[240px] min-h-[400px] hover:cursor-pointer">
                    <div className="flex items-center gap-1 text-neutral-600">
                      <GoPlus />
                      <MdOutlineDirectionsBike />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add bike</DialogTitle>
                    <DialogDescription>
                      Fill up the form below with the details of the new bike.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="flex flex-col justify-center items-center gap-4 px-4 pt-8"
                    onSubmit={(e) => addBike(e)}
                  >
                    {bikeAditionError && (
                      <p className="text-red-600 text-sm">{bikeAditionError}</p>
                    )}
                    <Input
                      id="bikeId"
                      type="number"
                      placeholder="Bike id"
                      className="md:w-4/5"
                      required
                    />
                    <Input
                      id="bikeImage"
                      type="file"
                      placeholder="Bike image"
                      className="md:w-4/5"
                      required
                    />
                    <Input
                      id="bikeCategory"
                      type="text"
                      placeholder="Bike category"
                      className="md:w-4/5"
                      required
                    />
                    <Input
                      id="bikeName"
                      type="text"
                      placeholder="Bike name"
                      className="md:w-4/5"
                      required
                    />
                    <Input
                      id="bikePrice"
                      type="number"
                      placeholder="Bike price"
                      className="md:w-4/5"
                      required
                    />
                    <Button
                      className="flex justify-center gap-2 rounded-lg w-[30vh]"
                      variant="primary"
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? (
                        <>
                          Loading <LoadingSVG />
                        </>
                      ) : (
                        "Add"
                      )}
                    </Button>
                    <DialogClose
                      className="font-semibold text-green-500 text-sm"
                      disabled={loading}
                    >
                      Cancel
                    </DialogClose>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="z-20 bg-green-500 w-[2px]" />
        <ResizablePanel defaultSize={15} className="bg-white">
          <div className="top-0 right-0 z-10 absolute bg-gradient-to-r from-transparent to-white w-[4vw] h-full"></div>
          <FilterMenu />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
