"use client";

import React, { useEffect } from "react";
import { TbBikeOff } from "react-icons/tb";
import Button from "./components/Button/Button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  useEffect(() => {
    document.title = "Bike4Cash | Page not Found";
  }, []);

  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-screen h-[80vh]">
      <TbBikeOff className="text-3xl" />
      <h2 className="font-semibold text-sm md:text-base">
        We couldn't find this page.
      </h2>
      <div className="flex flex-wrap items-center gap-[3px] text-sm md:text-[15px]">
        You can click{" "}
        <Button
          variant="tertiary"
          className="font-bold underline"
          onClick={() => router.back()}
        >
          here
        </Button>{" "}
        to go back.
      </div>
    </div>
  );
}
