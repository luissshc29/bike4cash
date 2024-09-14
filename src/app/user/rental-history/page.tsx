"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IBike } from "@/utils/types/IBike";
import Banner from "@/app/components/Banner/Banner";
import { getUserTransactions } from "@/utils/functions/user";
import ExpandedCard from "@/app/components/ExpandedCard/ExpandedCard";
import { ITransaction } from "@/utils/types/ITransaction";
import { gql, useQuery } from "@apollo/client";

export default function RentalHistoryPage() {
  const session = useSession();

  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [userBikes, setUserBikes] = useState<IBike[]>([]);
  const [userTransactions, setUserTransactions] = useState<ITransaction[]>([]);

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

  const { data, loading } = useQuery(BIKES_QUERY);

  async function getTransactions() {
    if (session.status === "authenticated") {
      // Getting the user transactions
      const transactionArray = (await getUserTransactions(session)) as {
        transactions: ITransaction[];
      };
      setUserTransactions(transactionArray.transactions);

      // Getting all the bikes the user rent

      const bikesArray: IBike[] = [];

      if (!loading) {
        for (let i = 0; i < transactionArray.transactions.length; i++) {
          bikesArray.push(
            data.bikes[
              data.bikes.findIndex(
                (item: IBike) =>
                  item.id === transactionArray.transactions[i].bikeId
              )
            ]
          );
        }
      }

      setUserBikes(bikesArray);
      setLoadingPage(false);
    }
  }

  useEffect(() => {
    document.title = "Bike4Cash - My rental history";
    getTransactions();
  }, [session.status, loading]);

  if (loading || loadingPage) {
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
          Gathering your latest rent bikes...
        </h2>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <Banner height="50vh" src="/my-rental-history-page-banner.jpg">
        <h1 className="font-bold text-3xl text-white md:text-4xl text">
          My <span className="text-green-500">rental</span> history
        </h1>
      </Banner>
      {userBikes.length > 0 ? (
        <>
          <h2 className="border-neutral-400 mx-auto mt-8 mb-4 border-b-[1px] w-[80vw] font-semibold text-center text-lg text-neutral-500 md:text-xl">
            Check below the bike models you've already rent!
          </h2>
          <div className="flex flex-wrap justify-center gap-y-8 p-8">
            {userBikes.map((bike, index) => (
              <div className="border-neutral-300 border-b-[1px]" key={index}>
                <ExpandedCard
                  bike={bike}
                  userTransaction={
                    userTransactions[
                      userBikes.findIndex((item) => item.id === bike.id)
                    ]
                  }
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <h2 className="border-neutral-400 mx-auto mt-8 mb-4 border-b-[1px] w-[80vw] font-semibold text-center text-lg text-neutral-500 md:text-xl">
          You have not rent any bike yet :(
        </h2>
      )}
    </div>
  );
}
