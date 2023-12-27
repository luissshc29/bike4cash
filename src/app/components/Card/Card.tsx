"use client";

import { IBike } from "@/utils/types/IBike";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Button from "../Button/Button";

export default function Card({ bike }: { bike: IBike }) {
    const [favorite, setFavorite] = useState(false);

    return (
        <div
            className={`w-[240px] border-b-[1px] border-neutral-400 flex flex-wrap gap-2 p-4 shadow-md shadow-neutral-300 overflow-hidden relative [&>*:nth-child(5)]:hover:[transform:rotateY(180deg)] lg:[&>*:nth-child(5)]:hover:opacity-100`}
        >
            <img src={bike.image} alt={bike.name} className="w-full" />
            <p
                className={`text-white font-semibold px-2 py-1 text-[10px] rounded-full py-auto bg-bike-${bike.category.toLowerCase()}`}
            >
                {bike.category}
            </p>
            <h2 className="font-semibold">{bike.name}</h2>
            <p className="w-full">
                R${bike.price.toFixed(2).toString().replaceAll(".", ",")}/day
            </p>
            <div
                className="lg:opacity-0 rounded-full w-fit ml-auto mr-0 text-2xl absolute bottom-[5%] right-[10%] 
                transition-all duration-300 hover:cursor-pointer"
                onClick={() => setFavorite(!favorite)}
            >
                {favorite ? <FaHeart color={"#ff0000"} /> : <FaRegHeart />}
            </div>
            <Button
                link={true}
                href="/user/checkout"
                variant="secondary"
                className="w-3/5"
            >
                Rent
            </Button>
        </div>
    );
}
