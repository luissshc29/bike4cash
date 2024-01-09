"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IBike } from "@/utils/types/IBike";
import Card from "@/app/components/Card/Card";
import Banner from "@/app/components/Banner/Banner";
import { useToast } from "@/app/shadcnui/components/ui/use-toast";
import { getUserTransactions } from "@/utils/functions/user";
import ExpandedCard from "@/app/components/ExpandedCard/ExpandedCard";
import { ITransaction } from "@/utils/types/ITransaction";
import { bikes } from "@/assets/bikes";

export default function RentalHistoryPage() {
    const session = useSession();
    const { toast } = useToast();

    const [loading, setLoading] = useState<boolean>(true);
    const [userBikes, setUserBikes] = useState<IBike[]>([]);
    const [userTransactions, setUserTransactions] = useState<ITransaction[]>(
        []
    );

    async function getTransactions() {
        if (session.status === "authenticated") {
            // Getting the user transactions
            const transactionArray = (await getUserTransactions(session)) as {
                transactions: ITransaction[];
            };
            setUserTransactions(transactionArray.transactions);

            // Getting all the bikes the user rent

            const bikesArray: typeof bikes = [];
            for (let i = 0; i < transactionArray.transactions.length; i++) {
                bikesArray.push(
                    bikes[
                        bikes.findIndex(
                            (item) =>
                                item.id ===
                                transactionArray.transactions[i].bikeId
                        )
                    ]
                );
            }
            setUserBikes(bikesArray);
            setLoading(false);
        }
    }

    useEffect(() => {
        document.title = "Bike4Cash - My rental history";
        getTransactions();
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
            <Banner height="50vh" src="/my-rental-history-page-banner.jpg">
                <h1 className="text-3xl md:text-4xl font-bold text-white text">
                    My <span className="text-green-500">rental</span> history
                </h1>
            </Banner>
            {userBikes.length > 0 ? (
                <>
                    <h2 className="w-[80vw] text-center mx-auto mt-8 mb-4 font-semibold text-lg md:text-xl text-neutral-500 border-b-[1px] border-neutral-400">
                        Check below the bike models you've already rent!
                    </h2>
                    <div className="p-8 flex flex-wrap gap-y-8 justify-center">
                        {userBikes.map((bike, index) => (
                            <div
                                className="border-b-[1px] border-neutral-300"
                                key={index}
                            >
                                <ExpandedCard
                                    bike={bike}
                                    userTransaction={
                                        userTransactions[
                                            userBikes.findIndex(
                                                (item) => item.id === bike.id
                                            )
                                        ]
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <h2 className="w-[80vw] text-center mx-auto mt-8 mb-4 font-semibold text-lg md:text-xl text-neutral-500 border-b-[1px] border-neutral-400">
                    You have not rent any bike yet :(
                </h2>
            )}
        </div>
    );
}
