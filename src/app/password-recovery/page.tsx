"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../shadcnui/components/ui/input";
import Button from "../components/Button/Button";
import LoadingSVG from "@/utils/svg/LoadingSVG";
import { toast } from "../shadcnui/components/ui/use-toast";

type DataType = {
  email: string;
};

export default function PasswordRecoveryPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DataType>();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<DataType> = async (data) => {
    try {
      setLoading(true);
      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });
      console.log(await res.json());
      if (res.ok) {
        toast({
          title: "Email sent!",
          description: "Check your inbox and/or spam folder.",
          className: "bg-green-500 text-white",
        });
        reset();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Oops!",
        description:
          "There was a problem with the email you provided! Please, try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    document.title = "Bike4Cash | Password Recovery";
  }, []);

  return (
    <div className="pb-16 md:pb-0">
      <form
        className="flex flex-col justify-center items-center animate-content-right [@media(min-width:740px)]:animate-content-bottom gap-4 border-4 border-green-500 shadow-lg shadow-neutral-400 mx-auto mt-8 px-4 py-8 w-[90vw] text-center transition-all duration-350 overflow-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="font-bold text-3xl text-green-500">
          Forgot your password?
        </h2>
        <p className="mb-6 text-neutral-600 text-sm">
          Type below your email for recovery!
        </p>
        <Input
          type="email"
          placeholder="Your email for recovery"
          className="md:w-3/5"
          {...register("email", { required: true })}
        />
        <Button
          className="flex justify-center gap-2 rounded-xl w-[30vh]"
          variant="primary"
          disabled={loading}
        >
          {loading ? (
            <>
              Loading <LoadingSVG />
            </>
          ) : (
            "Send"
          )}
        </Button>
        <Button
          variant="tertiary"
          className="text-sm"
          link={true}
          href={"/api/auth/signin"}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}
