"use client";

import { categories } from "@/utils/options/categories";
import { IBike } from "@/utils/types/IBike";
import { ITransaction } from "@/utils/types/ITransaction";
import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { FaRegMessage } from "react-icons/fa6";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { useSession } from "next-auth/react";
import { getUserData } from "@/utils/functions/user";
import { Popover } from "@radix-ui/react-popover";
import {
  PopoverContent,
  PopoverTrigger,
} from "@/app/shadcnui/components/ui/popover";
import { Textarea } from "@/app/shadcnui/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/app/shadcnui/components/ui/use-toast";

export default function ExpandedCard({
  bike,
  userTransaction,
}: {
  bike: IBike;
  userTransaction?: ITransaction;
}) {
  const { toast } = useToast();
  const session = useSession();
  const [bikeRating, setBikeRating] = useState<number>();
  const [message, setMessage] = useState<string>("");
  const ratingStars = [
    {
      id: 1,
      value: 1,
      color: "#ef4444",
    },
    {
      id: 2,
      value: 2,
      color: "#ef4444",
    },
    {
      id: 3,
      value: 3,
      color: "#eab308",
    },
    {
      id: 4,
      value: 4,
      color: "#22c55e",
    },
    {
      id: 5,
      value: 5,
      color: "#22c55e",
    },
  ];

  async function getBikeRatings() {
    if (session.status === "authenticated") {
      try {
        const username = (await getUserData(session)).username;
        const res = await fetch(
          `/api/bike/rating/get/by-user/?search-for=${username}`
        );
        const json: {
          userbikeRatings: {
            username: string;
            bikeId: number;
            rating: number;
            message: string;
          }[];
        } = await res.json();
        const jsonBikeIndex = json.userbikeRatings.findIndex(
          (item) => item.bikeId === bike.id
        );
        if (jsonBikeIndex > -1) {
          setBikeRating(json.userbikeRatings[jsonBikeIndex].rating);
          setMessage(json.userbikeRatings[jsonBikeIndex].message);
          setNewRating(false);
        } else {
          setBikeRating(0);
          setNewRating(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Checking if the bike is a new one or has already been rated before
  const [newRating, setNewRating] = useState<boolean>(true);
  const [editingRating, setEditingRating] = useState<boolean>(false);

  async function submitRating() {
    if (session.status === "authenticated") {
      const username = (await getUserData(session)).username;
      const data = {
        username: username,
        bikeId: bike.id,
        rating: bikeRating,
        message: message,
      };
      if (newRating) {
        try {
          const res = await fetch("/api/bike/rating/create", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            toast({
              title: "Done!",
              description: "Bike rated succesfully!",
              className: "bg-green-500 text-white",
            });
          } else {
            throw new Error();
          }
        } catch (error) {
          toast({
            title: "Oops!",
            description:
              "There was a problem rating this bike! Please, try again.",
            variant: "destructive",
          });
        }
      } else {
        try {
          const res = await fetch("/api/bike/rating/update", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            toast({
              title: "Done!",
              description: "Rating updated succesfully!",
              className: "bg-green-500 text-white",
            });
          } else {
            throw new Error();
          }
        } catch (error) {
          toast({
            title: "Oops!",
            description:
              "There was a problem updating your rating! Please, try again.",
            variant: "destructive",
          });
        }
      }
      setEditingRating(false);
    }
  }

  useEffect(() => {
    getBikeRatings();
  }, [session.status]);

  return (
    <div className="p-4">
      {window.location.pathname === "/user/rental-history" && (
        <>
          <p className="font-semibold">
            Rent on {userTransaction?.transactionDate}
            {/*var localeDateString = new Date('06/01/2024').toLocaleDateString() // -> 01/06/2024*/}
            {/* new Date(localeDateString) // -> Sat Jan 06 2024*/}
          </p>
          <p className="text-xs">
            Period: <span>{userTransaction?.initialDate}</span> -{" "}
            <span>{userTransaction?.finalDate}</span>
          </p>
          <Button
            variant="tertiary"
            className="underline text-sm"
            link={true}
            href={`/user/checkout/?bike=${bike.id}`}
          >
            Rent again
          </Button>
        </>
      )}

      <div className="w-[90vw] mx-auto justify-evenly flex flex-col md:flex-row items-center my-8 px-4 py-8 shadow-lg shadow-neutral-300">
        <img
          className="w-[30%] md:w-[15%] px-2"
          src={bike.image}
          alt={bike.name}
        />
        <div className="border-l-[2px] text-md border-green-500 px-2 py-4 flex flex-col gap-3">
          <h2 className="text-sm md:text-md font-semibold">{bike.name}</h2>
          <p className="text-xs">
            <span className="text-neutral-600">Category:</span>{" "}
            <span
              className="h-fit white rounded-full px-2 text-white"
              style={{
                backgroundColor: categories.find(
                  (category) => category.name === bike.category
                )?.color,
              }}
            >
              {bike.category}
            </span>
          </p>
        </div>
        <p className="text-sm font-bold w-fit">
          <span className="text-neutral-600 font-semibold text-sm align-top">
            R$
          </span>
          <span className="text-4xl text-green-500 ">
            {bike.price.toFixed(2).slice(0, 3)}
          </span>
          ,{bike.price.toFixed(2).slice(4)} /day
        </p>
      </div>
      {window.location.pathname === "/user/rental-history" && (
        <>
          <div className="flex items-center gap-4 h-10">
            <p className="text-sm md:text-md">Rate your experience! - </p>
            <div className="flex gap-1 items-center">
              {ratingStars.map((star) => (
                <div key={star.id}>
                  {star.id <= (bikeRating as number) ? (
                    <IoIosStar
                      color={star.color}
                      className="text-xl hover:cursor-pointer"
                      onClick={() => {
                        setBikeRating(star.value);
                        setEditingRating(true);
                      }}
                    />
                  ) : (
                    <IoIosStarOutline
                      color={star.color}
                      className="text-xl hover:cursor-pointer"
                      onClick={() => {
                        setBikeRating(star.value);
                        setEditingRating(true);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <Popover>
              <PopoverTrigger>
                <FaRegMessage className="border-neutral-400 border-[1px] p-1 rounded-lg text-[26px] hover:cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col items-center">
                <Label
                  htmlFor="rating-textarea"
                  className="text-[14px] font-semibold w-full text-center mb-2"
                >
                  Send us a message!
                </Label>
                <Textarea
                  id="rating-textarea"
                  placeholder="Tell us your experience!"
                  defaultValue={message}
                  onChange={(e) => {
                    setEditingRating(true);
                    setMessage(e.target.value);
                  }}
                  className="placeholder:text-[13px] text-sm"
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="tertiary"
              className="underline text-sm duration-300"
              onClick={() => submitRating()}
              disabled={!editingRating}
            >
              Submit rating
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
