"use client";

import Button from "@/app/components/Button/Button";
import ExpandedCard from "@/app/components/ExpandedCard/ExpandedCard";
import { Calendar } from "@/app/shadcnui/components/ui/calendar";
import { Label } from "@/app/shadcnui/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/shadcnui/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/shadcnui/components/ui/select";
import { useToast } from "@/app/shadcnui/components/ui/use-toast";
import { getUserData } from "@/utils/functions/user";
import { paymentMethods } from "@/utils/options/paymentMethods";
import LoadingSVG from "@/utils/svg/LoadingSVG";
import { IBike } from "@/utils/types/IBike";
import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiCalendar } from "react-icons/ci";

export default function CheckoutPage() {
  const session = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [bike, setBike] = useState<IBike>();
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof paymentMethods)[0]>();

  const [initialDate, setInitialDate] = useState<Date | undefined>(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );
  const [finalDate, setFinalDate] = useState<Date | undefined>(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )
  );
  const [dateDiff, setDateDiff] = useState<number>(
    Number(
      (
        ((finalDate?.getTime() as number) -
          (initialDate?.getTime() as number)) /
        1000 /
        60 /
        60 /
        24
      ).toFixed(0)
    )
  );

  const installments = [
    {
      id: 1,
      number: 1,
      price:
        ((bike?.price as number) * (paymentMethod?.fee as number) * dateDiff) /
        1,
    },
    {
      id: 2,
      number: 2,
      price:
        ((bike?.price as number) * (paymentMethod?.fee as number) * dateDiff) /
        2,
    },
    {
      id: 3,
      number: 3,
      price:
        ((bike?.price as number) * (paymentMethod?.fee as number) * dateDiff) /
        3,
    },
    {
      id: 4,
      number: 4,
      price:
        ((bike?.price as number) * (paymentMethod?.fee as number) * dateDiff) /
        4,
    },
    {
      id: 5,
      number: 5,
      price:
        ((bike?.price as number) * (paymentMethod?.fee as number) * dateDiff) /
        5,
    },
  ];

  const [chosenInstallments, setChosenInstallments] =
    useState<(typeof installments)[0]>();

  const BIKE_QUERY = gql`
    #graphql
    query bike($id: Int!) {
      bike(id: $id) {
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

  const { data, loading, error } = useQuery<{ bike: IBike }>(BIKE_QUERY, {
    variables: {
      id: Number(searchParams.get("bike")),
    },
  });

  function getBike() {
    if (session.status === "authenticated") {
      if (!loading) {
        setBike(data?.bike);
        setLoadingPage(false);
      }
    }
  }

  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false);

  async function finishTransaction() {
    if (session.status === "authenticated") {
      let ableToFinish = true;
      if (paymentMethod) {
        if (paymentMethod.value === "credit-card") {
          if (chosenInstallments === undefined) {
            ableToFinish = false;
          }
        }
        if (dateDiff <= 0) [(ableToFinish = false)];
      }
      if (ableToFinish) {
        const username = (await getUserData(session)).username;
        const data = {
          username: username,
          bikeId: bike?.id,
          paymentMethod: paymentMethod?.value,
          installments: chosenInstallments?.number || 1,
          initialDate: (initialDate as Date).toLocaleDateString(),
          finalDate: (finalDate as Date).toLocaleDateString(),
          totalPrice:
            (bike?.price as number) * (paymentMethod?.fee as number) * dateDiff,
          transactionDate: new Date().toLocaleDateString(),
        };
        try {
          setLoadingTransaction(true);
          const res = await fetch("/api/user/transaction/create", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            setPaymentMethod(undefined);
            toast({
              title: "Done!",
              description: (
                <div className="flex flex-col">
                  <p>
                    Your transaction was finished succesfully! You will be
                    redirected to the home page shortly.
                  </p>
                  <div className="bg-green-500 my-auto mt-8 rounded-full h-[6px]">
                    <div className="bg-white rounded-full w-[0%] w-full h-full transition-all animate-loading-bar duration-7000"></div>
                  </div>
                </div>
              ),
              className: "bg-green-500 text-white",
              duration: 7000,
            });
            setTimeout(() => {
              if (window.location.pathname === "/user/checkout") {
                router.push("/bikes/?category=all");
              }
            }, 7000);
          } else {
            throw new Error();
          }
        } catch (error) {
          toast({
            title: "Oops!",
            description:
              "There was a problem with your transaction! Please try again.",
            variant: "destructive",
            duration: 7000,
          });
        }
        setLoadingTransaction(false);
      }
    }
  }

  function handleDateChange() {
    const diff =
      (finalDate?.getTime() as number) - (initialDate?.getTime() as number);
    setDateDiff(Number((diff / 1000 / 60 / 60 / 24).toFixed(0)));
  }

  useEffect(() => {
    document.title = "Bike4Cash - Checkout";
    getBike();
    handleDateChange();
  }, [session.status, initialDate, finalDate, paymentMethod, loading]);

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
          Gathering your checkout details...
        </h2>
      </div>
    );
  }

  return (
    <div>
      {bike ? (
        <>
          <ExpandedCard bike={bike} />
          <div className="flex md:flex-row flex-col justify-between items-start border-neutral-300 mx-auto mt-8 py-8 p-8 pb-16 border-t-[1px] w-[95vw]">
            <div className="flex flex-col gap-4 w-full md:w-1/4">
              <div>
                <Label htmlFor="payment-select">Select a payment method:</Label>
                <Select
                  onValueChange={(e) =>
                    setPaymentMethod(
                      paymentMethods.find(
                        (item) => item.value === e
                      ) as typeof paymentMethod
                    )
                  }
                >
                  <SelectTrigger id="payment-select">
                    <SelectValue placeholder="Payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Methods</SelectLabel>
                      {paymentMethods.map((item) => (
                        <SelectItem
                          value={item.value}
                          key={item.id}
                          onSelect={() => setPaymentMethod(item)}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <Label>Select the period:</Label>
                <Popover>
                  <PopoverTrigger className="mb-2 w-full">
                    {" "}
                    <div className="flex justify-between items-center border-[1px] border-green-500 px-4 py-2 rounded-md text-left text-sm">
                      <p>Initial date: {initialDate?.toLocaleDateString()}</p>
                      <CiCalendar className="text-lg" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      fromDate={
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate()
                        )
                      }
                      mode="single"
                      selected={initialDate}
                      onSelect={(selectedDate) =>
                        setInitialDate(
                          new Date(
                            (selectedDate as Date).getFullYear(),
                            (selectedDate as Date).getMonth(),
                            (selectedDate as Date).getDate()
                          )
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger className="w-full">
                    {" "}
                    <div className="flex justify-between items-center border-[1px] border-green-500 px-4 py-2 rounded-md text-left text-sm">
                      <p>Final date: {finalDate?.toLocaleDateString()}</p>
                      <CiCalendar className="text-lg" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      fromDate={
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate() + 1
                        )
                      }
                      selected={finalDate}
                      onSelect={(selectedDate) =>
                        setFinalDate(
                          new Date(
                            (selectedDate as Date).getFullYear(),
                            (selectedDate as Date).getMonth(),
                            (selectedDate as Date).getDate()
                          )
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {paymentMethod?.value === "credit-card" && (
              <div className="animate-content-bottom mt-4 md:mt-0 w-full md:w-1/3 duration-300">
                <Label htmlFor="installments-select">
                  Select the number of installments:
                </Label>
                <Select
                  onValueChange={(e) => setChosenInstallments(JSON.parse(e))}
                >
                  <SelectTrigger id="installments-select">
                    <SelectValue placeholder="Installments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Number</SelectLabel>
                      {installments.map((item) => (
                        <SelectItem value={JSON.stringify(item)} key={item.id}>
                          {item.number} x R$
                          {item.price.toFixed(2).replace(".", ",")}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col items-star gap-2 mt-4 md:mt-0 w-full md:w-1/4">
              <h2 className="text-right border-neutral-400 border-b-[1px] w-full font-bold text-lg">
                Checkout
              </h2>
              <div>
                <p>
                  <span className="font-semibold">Price:</span> R$
                  {bike?.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Days:</span> {dateDiff}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Payment method fee:</span>{" "}
                  {(((paymentMethod?.fee || 1) - 1) * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold underline">Total:</span> R$
                  {(
                    (bike?.price as number) *
                    dateDiff *
                    (paymentMethod?.fee || 1)
                  )
                    .toFixed(2)
                    .replace(".", ",")}
                </p>
              </div>
              <Button
                disabled={
                  paymentMethod?.value === "credit-card"
                    ? chosenInstallments === undefined
                      ? true
                      : dateDiff === 0
                      ? true
                      : loadingTransaction
                      ? true
                      : false
                    : paymentMethod === undefined
                    ? true
                    : dateDiff === 0
                    ? true
                    : loadingTransaction
                    ? true
                    : false
                }
                onClick={() => finishTransaction()}
              >
                {loadingTransaction ? (
                  <>
                    Loading <LoadingSVG />
                  </>
                ) : (
                  "Finish"
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="border-neutral-400 mx-auto p-4 border-b-[1px] w-[80vw]">
          <h2 className="mt-8 mb-4 font-semibold text-center text-lg text-neutral-500 md:text-xl">
            You need to have a valid bike to checkout :(
          </h2>
          <div className="flex flex-wrap gap-1 text-xs md:text-sm">
            Return to our{" "}
            <Button
              variant="tertiary"
              link={true}
              href="/bikes/?category=all"
              className="w-fit italic"
            >
              Bikes
            </Button>{" "}
            page and select one.
          </div>
        </div>
      )}
    </div>
  );
}
