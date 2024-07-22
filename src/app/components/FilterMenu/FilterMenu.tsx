"use client";

import { useFilterMenuContext } from "@/app/context/FilterMenuContext";
import { Input } from "@/app/shadcnui/components/ui/input";
import { Label } from "@/app/shadcnui/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/app/shadcnui/components/ui/radio-group";
import { Slider } from "@/app/shadcnui/components/ui/slider";
import { bikes } from "@/assets/bikes";
import { categories } from "@/utils/options/categories";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

type SearchData = {
  search: string;
};

export default function FilterMenu() {
  const { priceRange, setPriceRange, search, setSearch } =
    useFilterMenuContext();
  const [priceIndicator, setPriceIndicator] = useState<number>(priceRange);
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<SearchData>();

  const onSubmit: SubmitHandler<SearchData> = (data) => {
    setSearch(data.search);
    reset();
  };

  return (
    <div className="mx-auto my-4 p-4 lg:pr-0 min-w-[40vw] md:min-w-[30vw] md:w-3/5 lg:min-w-[20vw] flex flex-col gap-6 justify-center">
      <h2 className="font-semibold text-xl text-green-500 border-b-[1px] border-green-500 h-fit w-full text-left">
        Options
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-fit flex">
          <Input
            placeholder="Search for a bike model..."
            id="search-input"
            className="placeholder:text-sm rounded-r-none pr-1"
            {...register("search")}
          />
          <button
            type="submit"
            className="h-10 w-fit flex items-center border-2 border-neutral-300 border-l-0 px-3 py-2 rounded-l-none rounded-r-xl active:border-green-700 hover:border-l-2 hover:border-green-500 duration-150"
          >
            <IoIosSearch />
          </button>
        </div>
        {search && (
          <p className="text-xs leading-5 text-neutral-800">
            Showing results for: "{search}"{" "}
            <MdOutlineCancel
              color="#ff0000"
              className="inline-block w-fit h-full hover:cursor-pointer"
              onClick={() => setSearch("")}
            />
          </p>
        )}
      </form>
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Price range:</p>
        <Slider
          defaultValue={[priceRange]}
          max={250}
          step={1}
          onValueChange={(e) => setPriceIndicator(e[0])}
          onValueCommit={(e) => setPriceRange(e[0])}
        />
        <p className="text-xs">
          Max price:{" "}
          <span className="font-semibold">R$ {priceIndicator},00</span>
        </p>
      </div>
      <RadioGroup
        defaultValue={
          window.location.search.replace("?filter-by=", "") || "all"
        }
        onValueChange={(e) => router.push(`/bikes/?filter-by=${e}`)}
      >
        <div className="flex gap-2 items-center">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">All</Label>
          <p className="text-neutral-600">({bikes.length})</p>
        </div>
        <div className="flex gap-2 items-center">
          <RadioGroupItem value="recommended" id="recommended" />
          <Label htmlFor="recommended">Recommended</Label>
          <p className="text-neutral-600">
            ({bikes.filter((item) => item.recommended === true).length})
          </p>
        </div>
        {categories.map((item) => (
          <div className="flex gap-2 items-center" key={item.id}>
            <RadioGroupItem
              value={item.name.toLowerCase()}
              id={item.name.toLowerCase()}
            />
            <Label htmlFor={item.name.toLowerCase()}>{item.name}</Label>
            <p className="text-neutral-600">
              (
              {
                bikes.filter(
                  (bike) =>
                    bike.category.toLowerCase() === item.name.toLowerCase()
                ).length
              }
              )
            </p>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
