"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IBike } from "@/utils/types/IBike";
import Card from "@/app/components/Card/Card";
import Banner from "@/app/components/Banner/Banner";
import { useToast } from "@/app/shadcnui/components/ui/use-toast";
import { getUserData, getUserFavorites } from "@/utils/functions/user";

export default function FavoritesPage() {
    const session = useSession();
    const { toast } = useToast();

    const [loading, setLoading] = useState<boolean>(true);
    const [userFavorites, setUserFavorites] = useState<IBike[]>([]);

    async function getFavorites() {
        if (session.status === "authenticated") {
            const favoriteBikesArray = (await getUserFavorites(
                session
            )) as IBike[];
            setUserFavorites(favoriteBikesArray);
            setLoading(false);
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
                    var auxiliaryArray = userFavorites.filter(
                        (item) => item.id !== id
                    );
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

    if (loading) {
        return (
            <div className="scale-[0.3] h-[25vh]">
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
            </div>
        );
    }

    return (
        <div className="pb-8">
            <Banner height="50vh" src="/my-favorites-page-banner.jpg">
                <h1 className="text-3xl md:text-4xl font-bold text-white text">
                    My <span className="text-green-500">favorites</span>
                </h1>
            </Banner>
            {userFavorites.length > 0 ? (
                <>
                    <h2 className="w-[80vw] text-center mx-auto mt-8 mb-4 font-semibold text-lg md:text-xl text-neutral-500 border-b-[1px] border-neutral-400">
                        Check below the bike models you enjoyed the most!
                    </h2>
                    <div className="p-8 flex flex-wrap gap-y-8 justify-center">
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
                <h2 className="w-[80vw] text-center mx-auto mt-8 mb-4 font-semibold text-lg md:text-xl text-neutral-500 border-b-[1px] border-neutral-400">
                    You have not added any bike to your favorites yet :(
                </h2>
            )}
        </div>
    );
}
