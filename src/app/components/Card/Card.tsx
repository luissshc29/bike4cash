"use client";

import { IBike } from "@/utils/types/IBike";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaRegTrashAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Button from "../Button/Button";
import { categories } from "@/utils/options/categories";
import { useSession } from "next-auth/react";
import LoadingSVG from "@/utils/svg/LoadingSVG";
import { getUserData, getUserFavorites } from "@/utils/functions/user";
import { useToast } from "@/app/shadcnui/components/ui/use-toast";
import { IoIosStar } from "react-icons/io";

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
    const bikeCategory = categories.find(
        (category) => category.name === bike.category
    );

    async function checkIfFavorite() {
        setLoadingAction(true);
        if (session.status === "authenticated") {
            const favoritesArray = await getUserFavorites(session);
            if (favoritesArray) {
                const favoriteIds = favoritesArray.map((item) => item.id);
                if (favoriteIds.includes(bike.id)) {
                    setFavorite(true);
                } else {
                    setFavorite(false);
                }
            }
            setLoadingAction(false);
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

    useEffect(() => {
        checkIfFavorite();
    }, [session.status]);

    return (
        <div
            className={`w-[240px] border-b-[1px] border-neutral-400 flex flex-wrap gap-2 p-4 shadow-md shadow-neutral-300 relative ${
                session.data &&
                window.location.pathname !== "/user/favorites" &&
                "[&>*:nth-last-child(2)]:hover:[transform:rotateY(180deg)] lg:[&>*:nth-last-child(2)]:hover:opacity-100"
            }`}
        >
            <div className="text-xl absolute right-0 top-[-2px] flex items-center gap-1 rounded-lg shadow-sm shadow-neutral-300 py-1 px-2">
                {window.location.pathname !== "/user/favorites" && (
                    <>
                        <p className="text-sm font-semibold">
                            {bike.rating?.toFixed(1)}
                        </p>
                        {(bike.rating as number) >= 4 ? (
                            <IoIosStar className="text-[#22c55e] animate-pulse" />
                        ) : (bike.rating as number) < 3 ? (
                            <IoIosStar className="text-[#ef4444]" />
                        ) : (
                            <IoIosStar className="text-[#eab308]" />
                        )}
                    </>
                )}
            </div>
            {window.location.pathname === "/user/favorites" && (
                <div className="flex items-center justify-center absolute right-[-5%] top-[-5%] rounded-full text-lg w-8 h-8 shadow-md shadow-neutral-300 z-10 bg-white text-green-500 overflow-visible ">
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
                    backgroundColor: bikeCategory?.color,
                }}
            >
                {bike.category}
            </p>
            <h2 className="font-semibold">
                {bike.name.length > 50
                    ? bike.name.slice(0, 50) + "..."
                    : bike.name}
            </h2>
            <p className="w-full">
                R${bike.price.toFixed(2).toString().replaceAll(".", ",")}/day
            </p>
            {session.data && window.location.pathname !== "/user/favorites" && (
                <div
                    className="lg:opacity-0 rounded-full w-fit ml-auto mr-0 text-2xl absolute bottom-[5%] right-[10%] 
                transition-all duration-300"
                >
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
