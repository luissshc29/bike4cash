"use client";

import { IBike } from "@/utils/types/IBike";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaRegTrashAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Button from "../Button/Button";
import { useSession } from "next-auth/react";
import LoadingSVG from "@/utils/svg/LoadingSVG";
import { getUserData } from "@/utils/functions/user";
import { useToast } from "@/app/shadcnui/components/ui/use-toast";
import { IoIosStar } from "react-icons/io";
import { MdVerified } from "react-icons/md";
import { gql, useQuery } from "@apollo/client";

export default function Card({
  bike,
  loadingDeletion = false,
  onDelete,
}: {
  bike: IBike;
  loadingDeletion?: boolean;
  onDelete?: () => void;
}) {
  const session = useSession();
  const [favorite, setFavorite] = useState<boolean>(false);
  const { toast } = useToast();

  async function checkIfBikeIsFavorite(id: number) {
    if (session.status === "authenticated") {
      const username = (await getUserData(session)).username;
      const res = await fetch(`/api/user/favorite/get/?search-for=${username}`);
      const json: { favorites: { username: string; bikeId: number }[] } =
        await res.json();
      const idArray = json.favorites.map((item) => item.bikeId);

      setFavorite(idArray.includes(id));
    }
  }

  const [loadingAction, setLoadingAction] = useState<boolean>(false);

  async function addUserFavorite(id: number) {
    if (session.status === "authenticated") {
      const username = (await getUserData(session)).username;
      try {
        setLoadingAction(true);
        const res = await fetch(`/api/user/favorite/add`, {
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
          setFavorite(true);
          toast({
            className: "text-white bg-green-500",
            title: "Done!",
            description: "Favorite added succesfully!",
          });
        } else {
          toast({
            title: "Sorry! We had a problem adding this item.",
            description: "Please, try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Sorry! We had a problem adding this item.",
          description: "Please, try again.",
          variant: "destructive",
        });
      }
      setLoadingAction(false);
    }
  }

  async function deleteUserFavorite(id: number) {
    if (session.status === "authenticated") {
      const username = (await getUserData(session)).username;
      try {
        setLoadingAction(true);
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
          setFavorite(false);
          toast({
            className: "text-white bg-green-500",
            title: "Done!",
            description: "Favorite deleted succesfully!",
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
      setLoadingAction(false);
    }
  }

  const BIKE_CATEGORY_QUERY = gql`
    #graphql
    query category($name: String!) {
      category(name: $name) {
        id
        name
        color
      }
    }
  `;

  const bikeCategoryQuery = useQuery(BIKE_CATEGORY_QUERY, {
    variables: {
      name: bike.category,
    },
  });

  useEffect(() => {
    checkIfBikeIsFavorite(bike.id);
  }, [session.status]);

  if (!bikeCategoryQuery.loading) {
    return (
      <div
        className={`w-[240px] border-b-[1px] border-neutral-400 flex flex-wrap gap-2 p-4 shadow-md shadow-neutral-300 relative ${
          session.data &&
          window.location.pathname !== "/user/favorites" &&
          "[&>*:nth-last-child(2)]:hover:[transform:rotateY(180deg)] lg:[&>*:nth-last-child(2)]:hover:opacity-100"
        }`}
        title={bike.name}
      >
        <div className="top-[-2px] right-0 absolute flex items-center gap-1 shadow-neutral-300 shadow-sm px-2 py-1 rounded-lg text-xl">
          {window.location.pathname !== "/user/favorites" && (
            <>
              <p className="font-semibold text-sm">
                {bike.rating?.average.toFixed(1)}
              </p>
              {bike.recommended ? (
                <MdVerified
                  className="text-[#405de6] text-xl"
                  title="Recommended by users"
                />
              ) : (bike.rating?.average as number) >= 4 ? (
                <IoIosStar className="text-[#22c55e]" />
              ) : (bike.rating?.average as number) < 3 ? (
                <IoIosStar className="text-[#ef4444]" />
              ) : (
                <IoIosStar className="text-[#eab308]" />
              )}
            </>
          )}
        </div>
        {window.location.pathname === "/user/favorites" && (
          <div className="top-[-5%] right-[-5%] z-10 absolute flex justify-center items-center bg-white shadow-md shadow-neutral-300 rounded-full w-8 h-8 text-green-500 text-lg overflow-visible">
            {loadingDeletion ? (
              <div className="h-fit">
                <LoadingSVG />
              </div>
            ) : (
              <FaRegTrashAlt
                className="hover:cursor-pointer"
                onClick={onDelete}
              />
            )}
          </div>
        )}
        <img src={bike.image} alt={bike.name} className="w-full" />
        <p
          className={`text-white h-fit font-semibold px-2 py-1 text-[10px] rounded-full py-auto`}
          style={{
            backgroundColor: bikeCategoryQuery.data.category?.color,
          }}
        >
          {bike.category}
        </p>
        <h2 className="font-semibold">
          {bike.name.length > 50 ? bike.name.slice(0, 50) + "..." : bike.name}
        </h2>
        <p className="w-full">
          R${bike.price.toFixed(2).toString().replaceAll(".", ",")}/day
        </p>
        {session.data && window.location.pathname !== "/user/favorites" && (
          <div className="right-[10%] bottom-[5%] absolute lg:opacity-0 mr-0 ml-auto rounded-full w-fit text-2xl transition-all duration-300">
            {loadingAction ? (
              <LoadingSVG />
            ) : favorite ? (
              <FaHeart
                color={"#ff0000"}
                className="hover:cursor-pointer"
                onClick={() => deleteUserFavorite(bike.id)}
              />
            ) : (
              <FaRegHeart
                className="hover:cursor-pointer"
                onClick={() => addUserFavorite(bike.id)}
              />
            )}
          </div>
        )}

        <Button
          link={true}
          href={`/user/checkout/?bike=${bike.id}`}
          variant="secondary"
          className="w-3/5"
        >
          Rent
        </Button>
      </div>
    );
  }
}
