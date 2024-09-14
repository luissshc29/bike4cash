"use client";

import React, { useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import Card from "../components/Card/Card";
import { useSearchParams } from "next/navigation";
import FilterMenu from "../components/FilterMenu/FilterMenu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../shadcnui/components/ui/resizable";
import { IBike } from "@/utils/types/IBike";
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
import { gql, useQuery } from "@apollo/client";

export default function BikesPage() {
  const [selectedBikes, setSelectedBikes] = useState<IBike[]>([]);
  const searchParams = useSearchParams();
  const session = useSession();

  const [loadingUserFetch, setLoadingUserFetch] = useState<boolean>(true);

  const BIKES_QUERY = gql`
    #graphql
    query bikes($category: String, $maxPrice: Int, $search: String) {
      bikes(category: $category, maxPrice: $maxPrice, search: $search) {
        id
        image
        name
        price
        category
        recommended
        rating {
          average
          list {
            id
            message
            rating
            username
          }
        }
      }
    }
  `;

  const { data, loading, error, refetch } = useQuery(BIKES_QUERY, {
    variables: {
      category: searchParams.get("category") || "",
      maxPrice: Number(searchParams.get("maxPrice")) || null,
      search: searchParams.get("search") || "",
    },
  });
  async function getSelectedBikes() {
    if (!loading) {
      if (data) {
        setSelectedBikes(data.bikes);
        getUser();
      }
    }
  }

  const [username, setUsername] = useState<string>("");
  async function getUser() {
    if (session.status === "authenticated") {
      try {
        const username = (await getUserData(session)).username;
        setUsername(username);
        setLoadingUserFetch(false);
      } catch (error) {
        console.log("Couldn't obtain username");
      } finally {
      }
    } else {
      setLoadingUserFetch(false);
    }
  }

  const [bikeAddingError, setBikeAddingError] = useState<string>("");

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
    const date = new Date().toLocaleDateString();
    window.location.href = `https://api.whatsapp.com/send?phone=+5585989513959&text=Pedido%20%230001%0ABike%20ID%3A%20${bikeId}%0ABike%20Name%3A%20${bikeName}%20%28Category%2${bikeCategory}%29%0AData%3A%${date}%0APagamento%3A%20PIX%0ABike%20Price%3A%20R%24%20${bikePrice}
`;
    console.log(bikeId, bikeCategory, bikeName, bikePrice);
  };

  useEffect(() => {
    document.title = "Bike4Cash | Our Bikes";
    refetch();
    getSelectedBikes();
  }, [session.status, searchParams, loading]);

  if (loading || loadingUserFetch) {
    return (
      <div className="flex flex-col justify-center items-center my-auto h-[50vh]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="w-fit scale-[.3] md:scale-[.5] mb-[-4rem] h-fit"
        >
          <circle
            fill="#22C55E"
            stroke="#22C55E"
            strokeWidth="9"
            r="15"
            cx="50"
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
            r="15"
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
            r="15"
            cx="150"
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
        <h2 className="font-semibold text-base text-center text-green-500 md:text-xl lg:text-xl">
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
                    {bikeAddingError && (
                      <p className="text-red-600 text-sm">{bikeAddingError}</p>
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
        <ResizableHandle withHandle className="z-[20] bg-green-500 w-[2px]" />
        <ResizablePanel
          defaultSize={15}
          maxSize={75}
          className="relative bg-white"
        >
          <div className="top-0 right-0 z-10 absolute bg-gradient-to-r from-transparent to-white w-[4vw] h-full"></div>
          <FilterMenu selectedBikes={selectedBikes} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
