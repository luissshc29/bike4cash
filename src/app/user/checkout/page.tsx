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
import { bikes } from "@/assets/bikes";
import { getUserData } from "@/utils/functions/user";
import { paymentMethods } from "@/utils/options/paymentMethods";
import LoadingSVG from "@/utils/svg/LoadingSVG";
import { IBike } from "@/utils/types/IBike";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiCalendar } from "react-icons/ci";

export default function CheckoutPage() {
    const session = useSession();
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
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
                ((bike?.price as number) *
                    (paymentMethod?.fee as number) *
                    dateDiff) /
                1,
        },
        {
            id: 2,
            number: 2,
            price:
                ((bike?.price as number) *
                    (paymentMethod?.fee as number) *
                    dateDiff) /
                2,
        },
        {
            id: 3,
            number: 3,
            price:
                ((bike?.price as number) *
                    (paymentMethod?.fee as number) *
                    dateDiff) /
                3,
        },
        {
            id: 4,
            number: 4,
            price:
                ((bike?.price as number) *
                    (paymentMethod?.fee as number) *
                    dateDiff) /
                4,
        },
        {
            id: 5,
            number: 5,
            price:
                ((bike?.price as number) *
                    (paymentMethod?.fee as number) *
                    dateDiff) /
                5,
        },
    ];

    const [chosenInstallments, setChosenInstallments] =
        useState<(typeof installments)[0]>();

    function getBike() {
        if (session.status === "authenticated") {
            const url = new URL(window.location.href);
            const bikeId = Number(url.search.replace("?bike=", ""));
            setBike(bikes.find((item) => item.id === bikeId));
            setLoading(false);
        }
    }

    const [loadingTransaction, setLoadingTransaction] =
        useState<boolean>(false);

    async function finishTransaction() {
        if (session.status === "authenticated") {
            var ableToFinish = true;
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
                        (bike?.price as number) *
                        (paymentMethod?.fee as number) *
                        dateDiff,
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
                                        Your transaction was finished
                                        succesfully! You will be redirected to
                                        the home page shortly.
                                    </p>
                                    <div className="h-[6px] bg-green-500 mt-8 rounded-full my-auto">
                                        <div
                                            className="h-full w-[0%] bg-white rounded-full animate-loading-bar 
                                        transition-all duration-7000 w-full"
                                        ></div>
                                    </div>
                                </div>
                            ),
                            className: "bg-green-500 text-white",
                            duration: 7000,
                        });
                        setTimeout(() => {
                            if (window.location.pathname === "/user/checkout") {
                                router.push("/bikes/?filter-by=all");
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
        var diff =
            (finalDate?.getTime() as number) -
            (initialDate?.getTime() as number);
        setDateDiff(Number((diff / 1000 / 60 / 60 / 24).toFixed(0)));
    }

    useEffect(() => {
        document.title = "Bike4Cash - Checkout";
        getBike();
        handleDateChange();
    }, [session.status, initialDate, finalDate, paymentMethod]);

    if (loading) {
        return (
            <div className="scale-[0.3] h-[20vh]">
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
                <h2 className="scale-[2.5] font-semibold text-green-500 text-xl text-center">
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
                    <div className="flex flex-col md:flex-row items-start justify-between p-8 pb-16 w-[95vw] mx-auto mt-8 py-8 border-t-[1px] border-neutral-300">
                        <div className="w-full md:w-1/4 flex flex-col gap-4">
                            <div>
                                <Label htmlFor="payment-select">
                                    Select a payment method:
                                </Label>
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
                                                    onSelect={() =>
                                                        setPaymentMethod(item)
                                                    }
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
                                    <PopoverTrigger className="w-full mb-2">
                                        {" "}
                                        <div className="flex justify-between items-center text-sm px-4 py-2 rounded-md border-[1px] border-green-500 text-left">
                                            <p>
                                                Initial date:{" "}
                                                {initialDate?.toLocaleDateString()}
                                            </p>
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
                                                        (
                                                            selectedDate as Date
                                                        ).getFullYear(),
                                                        (
                                                            selectedDate as Date
                                                        ).getMonth(),
                                                        (
                                                            selectedDate as Date
                                                        ).getDate()
                                                    )
                                                )
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger className="w-full">
                                        {" "}
                                        <div className="flex justify-between items-center text-sm px-4 py-2 rounded-md border-[1px] border-green-500 text-left">
                                            <p>
                                                Final date:{" "}
                                                {finalDate?.toLocaleDateString()}
                                            </p>
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
                                                        (
                                                            selectedDate as Date
                                                        ).getFullYear(),
                                                        (
                                                            selectedDate as Date
                                                        ).getMonth(),
                                                        (
                                                            selectedDate as Date
                                                        ).getDate()
                                                    )
                                                )
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        {paymentMethod?.value === "credit-card" && (
                            <div className="mt-4 md:mt-0 animate-content-bottom duration-300 w-full md:w-1/3">
                                <Label htmlFor="installments-select">
                                    Select the number of installments:
                                </Label>
                                <Select
                                    onValueChange={(e) =>
                                        setChosenInstallments(JSON.parse(e))
                                    }
                                >
                                    <SelectTrigger id="installments-select">
                                        <SelectValue placeholder="Installments" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Number</SelectLabel>
                                            {installments.map((item) => (
                                                <SelectItem
                                                    value={JSON.stringify(item)}
                                                    key={item.id}
                                                >
                                                    {item.number} x R$
                                                    {item.price
                                                        .toFixed(2)
                                                        .replace(".", ",")}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="mt-4 md:mt-0 flex flex-col gap-2 items-star w-full md:w-1/4">
                            <h2 className="font-bold text-lg border-b-[1px] border-neutral-400 w-full text-right">
                                Checkout
                            </h2>
                            <div>
                                <p>
                                    <span className="font-semibold">
                                        Price:
                                    </span>{" "}
                                    R$
                                    {bike?.price.toFixed(2).replace(".", ",")}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-semibold">Days:</span>{" "}
                                    {dateDiff}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-semibold">
                                        Payment method fee:
                                    </span>{" "}
                                    {(
                                        ((paymentMethod?.fee || 1) - 1) *
                                        100
                                    ).toFixed(0)}
                                    %
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-semibold underline">
                                        Total:
                                    </span>{" "}
                                    R$
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
                <div className="border-b-[1px] border-neutral-400 w-[80vw] mx-auto p-4">
                    <h2 className="text-center mt-8 mb-4 font-semibold text-lg md:text-xl text-neutral-500">
                        You need to have a valid bike to checkout :(
                    </h2>
                    <div className="flex flex-wrap gap-1 text-xs md:text-sm">
                        Return to our{" "}
                        <Button
                            variant="tertiary"
                            link={true}
                            href="/bikes/?filter-by=all"
                            className="italic w-fit"
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
