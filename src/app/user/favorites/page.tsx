"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IBike } from "@/utils/types/IBike";
import Card from "@/app/components/Card/Card";
import Banner from "@/app/components/Banner/Banner";
import { useToast } from "@/app/shadcnui/components/ui/use-toast";
import { getUserData } from "@/utils/functions/user";
import { gql, useQuery } from "@apollo/client";

export default function FavoritesPage() {
  const session = useSession();
  const { toast } = useToast();

  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [userFavorites, setUserFavorites] = useState<IBike[]>([]);

  const BIKES_QUERY = gql`
    #graphql
    query bikes {
      bikes {
        id
        category
        name
        image
        price
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

  const { data, loading, error, refetch } = useQuery<{ bikes: IBike[] }>(
    BIKES_QUERY
  );

  async function getFavorites() {
    if (session.status === "authenticated") {
      const username = (await getUserData(session)).username;
      const res = await fetch(`/api/user/favorite/get/?search-for=${username}`);
      const json: { favorites: { username: string; bikeId: number }[] } =
        await res.json();
      const idArray = json.favorites.map((item) => item.bikeId);

      const favoriteBikesArray = data?.bikes.filter((item) =>
        idArray.includes(item.id)
      );
      setUserFavorites(favoriteBikesArray || []);
      setLoadingPage(false);
    }
  }

  const [loadingDeletion, setLoadingDeletion] = useState<boolean>(false);
  async function deleteFavorite(id: number) {
    if (session.status === "authenticated") {
      const username = (await getUserData(session)).username;
      try {
        setLoadingDeletion(true);
        const res = await fetch(`/api/user/favorite/delete`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            bikeId: id,
          }),
        });
        if (res.ok) {
          const auxiliaryArray = userFavorites.filter((item) => item.id !== id);
          setUserFavorites(auxiliaryArray);
          toast({
            className: "text-white bg-green-500",
            title: "Done!",
            description: "Item deleted succesfully!",
          });
        } else {
          toast({
            title: "Sorry! We had a problem deleting this item.",
            description: "Please, try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Sorry! We had a problem deleting this item.",
          description: "Please, try again.",
          variant: "destructive",
        });
      }
      setLoadingDeletion(false);
    }
  }

  useEffect(() => {
    document.title = "Bike4Cash - My favorites";
    getFavorites();
  }, [session.status]);

  if (loadingPage || loading) {
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
          Gathering your favorite bikes...
        </h2>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <Banner height="50vh" src="/my-favorites-page-banner.jpg">
        <h1 className="font-bold text-3xl text-white md:text-4xl text">
          My <span className="text-green-500">favorites</span>
        </h1>
      </Banner>
      {userFavorites.length > 0 ? (
        <>
          <h2 className="border-neutral-400 mx-auto mt-8 mb-4 border-b-[1px] w-[80vw] font-semibold text-center text-lg text-neutral-500 md:text-xl">
            Check below the bike models you enjoyed the most!
          </h2>
          <div className="flex flex-wrap justify-center gap-y-8 p-8">
            {userFavorites.map((item, index) => (
              <Card
                bike={item}
                key={index}
                loadingDeletion={loadingDeletion}
                onDelete={() => deleteFavorite(item.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <h2 className="border-neutral-400 mx-auto mt-8 mb-4 border-b-[1px] w-[80vw] font-semibold text-center text-lg text-neutral-500 md:text-xl">
          You have not added any bike to your favorites yet :(
        </h2>
      )}
    </div>
  );
}
