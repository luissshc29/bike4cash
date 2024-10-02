"use client";

import { Input } from "@/app/shadcnui/components/ui/input";
import { Label } from "@/app/shadcnui/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/app/shadcnui/components/ui/radio-group";
import { Slider } from "@/app/shadcnui/components/ui/slider";
import { IBike } from "@/utils/types/IBike";
import { ICategory } from "@/utils/types/ICategory";
import { gql, useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

type SearchData = {
  search: string;
};

export default function FilterMenu({
  selectedBikes,
}: {
  selectedBikes: IBike[];
}) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [category, setCategory] = useState<string>();
  const [maxPrice, setMaxPrice] = useState<number>(
    Number(searchParams.get("maxPrice")) || 250
  );
  const [priceIndicator, setPriceIndicator] = useState<number>(maxPrice);
  const [search, setSearch] = useState<string>();

  const { register, handleSubmit, reset } = useForm<SearchData>();

  const onSubmit: SubmitHandler<SearchData> = (data) => {
    router.push(
      `/bikes/?search=${data.search}${category ? `&category=${category}` : ""}${
        maxPrice ? `&maxPrice=${maxPrice}` : ""
      }`
    );
    reset();
  };

  const BIKE_CATEGORIES_QUERY = gql`
    #graphql
    query categories {
      categories {
        id
        name
        color
      }
    }
  `;

  const { data, loading } = useQuery(BIKE_CATEGORIES_QUERY);

  const elementRef = useRef<HTMLDivElement | null>(null);

  let elementOffsetHeight = 389;

  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    if (elementRef.current) {
      const scrollTop = window.scrollY;
      const triggerPoint = elementOffsetHeight;

      if (scrollTop >= 1.7 * triggerPoint) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
  };

  useEffect(() => {
    setMaxPrice(Number(searchParams.get("maxPrice")) || 250);
    setCategory(searchParams.get("category") || "all");
    setSearch(searchParams.get("search") || "");

    if (elementRef.current) {
      elementOffsetHeight = elementRef.current.offsetHeight;
    }

    window.addEventListener("scroll", () => handleScroll());

    return () => {
      window.removeEventListener("scroll", () => handleScroll());
    };
  }, [searchParams]);

  if (!loading) {
    return (
      <div
        className={`flex flex-col justify-center gap-6 px-4 w-[60vw] md:w-[35vw] lg:w-[25vw] bg-white transition-all duration-300 ease-in-out ${
          isSticky ? "fixed top-[2.5rem] " : "absolute top-[2.5rem] "
        }`}
        id="filter-menu"
        ref={elementRef}
      >
        <h2 className="border-green-500 border-b-[1px] w-full h-fit font-semibold text-green-500 text-left text-xl">
          Options
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex h-fit">
            <Input
              placeholder="Search for a bike model..."
              id="search-input"
              className="pr-1 rounded-r-none placeholder:text-sm"
              {...register("search")}
            />
            <button
              type="submit"
              className="flex items-center border-2 border-neutral-300 hover:border-green-500 active:border-green-700 px-3 py-2 border-l-0 hover:border-l-2 rounded-l-none rounded-r-xl w-fit h-10 duration-150"
            >
              <IoIosSearch />
            </button>
          </div>
          {search && (
            <p className="text-neutral-800 text-xs leading-5">
              Showing results for: "{search}"{" "}
              <MdOutlineCancel
                color="#ff0000"
                className="inline-block w-fit h-full hover:cursor-pointer"
                onClick={() =>
                  router.push(
                    `/bikes/?search=${category ? `&category=${category}` : ""}${
                      maxPrice ? `&maxPrice=${maxPrice}` : ""
                    }`
                  )
                }
              />
            </p>
          )}
        </form>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-md">Price range:</p>
          <Slider
            defaultValue={[maxPrice]}
            max={250}
            min={1}
            step={1}
            onValueChange={(e) => setPriceIndicator(e[0])}
            onValueCommit={(e) => {
              router.push(
                `/bikes/?maxPrice=${e[0]}${search ? `&search=${search}` : ""}${
                  category ? `&category=${category}` : ""
                }`
              );
            }}
          />
          <p className="text-xs">
            Max price:{" "}
            <span className="font-semibold">R$ {priceIndicator},00</span>
          </p>
        </div>
        <RadioGroup
          defaultValue={searchParams.get("category")?.toLowerCase() || "all"}
          onValueChange={(e) => {
            router.push(
              `/bikes/?category=${e}${search ? `&search=${search}` : ""}${
                maxPrice ? `&maxPrice=${maxPrice}` : ""
              }`
            );
          }}
        >
          <div
            className="flex items-center gap-2"
            style={
              selectedBikes.length === 0
                ? {
                    color: "rgb(82 82 82 / 0.5)",
                  }
                : {}
            }
          >
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All</Label>
            <p>({selectedBikes.length})</p>
          </div>
          <div
            className="flex items-center gap-2"
            style={
              selectedBikes.filter((bike) => bike.recommended).length === 0
                ? {
                    color: "rgb(82 82 82 / 0.5)",
                  }
                : {}
            }
          >
            <RadioGroupItem value="recommended" id="recommended" />
            <Label htmlFor="recommended">Recommended</Label>
            <p>({selectedBikes.filter((bike) => bike.recommended).length})</p>
          </div>
          {data.categories?.map((item: ICategory) => (
            <div
              className="flex items-center gap-2"
              key={item.id}
              style={
                selectedBikes.filter(
                  (bike) =>
                    bike.category.toLowerCase() === item.name.toLowerCase()
                ).length === 0
                  ? {
                      color: "rgb(82 82 82 / 0.5)",
                    }
                  : {}
              }
            >
              <RadioGroupItem
                value={item.name.toLowerCase()}
                id={item.name.toLowerCase()}
                disabled={
                  selectedBikes.filter(
                    (bike) =>
                      bike.category.toLowerCase() === item.name.toLowerCase()
                  ).length === 0
                }
              />
              <Label htmlFor={item.name.toLowerCase()}>{item.name}</Label>
              <p className="">
                (
                {
                  selectedBikes.filter(
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
}
