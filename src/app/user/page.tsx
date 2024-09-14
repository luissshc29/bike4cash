"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import { SubmitHandler, useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import Button from "../components/Button/Button";
import { Input } from "../shadcnui/components/ui/input";
import { Label } from "../shadcnui/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../shadcnui/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { imageUpload } from "../lib/cloudinary";
import { useToast } from "../shadcnui/components/ui/use-toast";
import LoadingSVG from "@/utils/svg/LoadingSVG";
import { generateFromEmail } from "unique-username-generator";
import { getUserData } from "@/utils/functions/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcnui/components/ui/dropdown-menu";
import { BsMenuApp } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineDirectionsBike } from "react-icons/md";
import Link from "next/link";

export type UserDataType = {
  username: string;
  name: string;
  email: string;
  address: string;
};

export default function UserPage() {
  const session = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);

  const loginMethod: "provider" | "credentials" = (session.data?.user
    ?.email as string)
    ? "provider"
    : "credentials";

  const [userData, setUserData] = useState<UserDataType & { image?: string }>({
    username: "",
    name: "",
    email: "",
    address: "",
    image: "",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserDataType>({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      address: "",
    },
  });

  async function getUser() {
    if (session.status === "authenticated") {
      const user: UserDataType & { image?: string } = await getUserData(
        session
      );
      if (user) {
        setUserData(user as UserDataType & { image?: string });
        reset({
          username: user.username,
          name: user.name,
          email: user.email,
          address: user.address,
        });
        setLoading(false);
      } else {
        const userName = generateFromEmail(
          session.data?.user?.email as string,
          2
        );
        const newUserLogin = {
          username: userName,
          password: "",
        };
        try {
          const res = await fetch("/api/user/create/user-login", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(newUserLogin),
          });
          if (res.ok) {
            const newUserData = {
              username: userName,
              name: session.data?.user?.name as string,
              email: session.data?.user?.email as string,
              image: session.data?.user?.image as string,
              address: "",
            };

            try {
              const res = await fetch("/api/user/create/user-data", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify(newUserData),
              });
              if (res.ok) {
                setUserData({
                  ...newUserData,
                  address: "",
                });
                reset({
                  ...newUserData,
                  address: "",
                });
                setLoading(false);
              } else {
                throw new Error();
              }
            } catch (error) {
              throw new Error();
            }
          } else {
            throw new Error();
          }
        } catch (error) {
          toast({
            title: "Sorry! We had a problem creating your profile",
            description: "Please, try again with some other method!",
            variant: "destructive",
          });
        }
      }
    }
  }

  const [editing, setEditing] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const onSubmitData: SubmitHandler<UserDataType> = async (data) => {
    setEditing(false);
    const newData: UserDataType = {
      username:
        loginMethod === "provider"
          ? data.username
          : (session.data?.user?.name as string),
      name: data.name,
      email: data.email,
      address: data.address,
    };
    try {
      setFormLoading(true);
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        setEditing(false);
        toast({
          title: "Done!",
          description: "Change(s) saved succesfully!",
          className: "bg-green-500 text-white",
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      setEditing(true);
      toast({
        title: "Oops!",
        description:
          "There was a problem saving your changes! Please, try again.",
        variant: "destructive",
      });
    }
    setFormLoading(false);
  };

  const [imageError, setImageError] = useState<string>("");
  const [imageSelected, setImageSelected] = useState<File | null>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  async function onSubmitPicture(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];

    //Checking if the selected file has a valid type
    if (supportedTypes.includes(imageSelected?.type as string)) {
      // Getting the file input element
      const fileInput = Array.from(event.currentTarget.elements).find(
        (item: any) => item.type === "file"
      ) as HTMLInputElement;

      // Creating a FormData
      const formData = new FormData();

      // Appending the chosen image to the FormData
      for (const file of fileInput.files as FileList) {
        formData.append("file", file);
      }

      // Appending the preset defined on cloudinary to the FormData
      formData.append("upload_preset", "my-uploads");

      try {
        setImageLoading(true);
        const res = await imageUpload(formData);
        const imageUrl: string = res.url;
        setUserData((user) => ({
          ...user,
          image: imageUrl,
        }));
        try {
          const res = await fetch("/api/user/image", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              url: imageUrl,
              username: userData.username,
            }),
          });
          console.log(await res.json());
          if (res.ok) {
            toast({
              title: "Done!",
              description: "Avatar changed succesfully!",
              className: "bg-green-500 text-white",
            });
            setImageSelected(null);
          } else {
            throw new Error();
          }
        } catch (error) {
          toast({
            title: "Oops!",
            description:
              "There was a problem changing your avatar! Please, try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Oops!",
          description: "There was a problem on the server! Please, try again.",
          variant: "destructive",
        });
      }
    } else {
      setImageError("This type of file is not supported");
      setTimeout(() => {
        setImageError("");
      }, 7000);
    }
    setImageLoading(false);
  }

  useEffect(() => {
    document.title = `Bike4Cash | ${session.data?.user?.name || "User"}`;
    getUser();
  }, [session.status]);

  if (loading) {
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
          Gathering your information...
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Banner height="50vh" src="user-page-banner.jpg">
        {session.status === "authenticated" && (
          <h1 className="font-bold text-3xl text-white md:text-4xl text">
            <span className="text-green-500">Welcome</span>,{" "}
            {userData.name || userData.username}!
          </h1>
        )}
      </Banner>
      <div className="flex justify-end w-screen">
        <DropdownMenu>
          <DropdownMenuTrigger className="border-[1px] border-neutral-400 m-4 my-4 p-2 rounded-lg">
            <MdOutlineDirectionsBike className="text-neutral-900" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[45vw] md:w-[30vw]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href={"/user/favorites"}
                  className="flex justify-between items-center w-full"
                >
                  <span>My favorites</span>
                  <MdFavoriteBorder className="text-lg" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={"/user/rental-history"}
                  className="flex justify-between items-center w-full"
                >
                  <span>My rental history</span>
                  <RiMoneyDollarCircleLine className="text-lg" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex lg:flex-row flex-col gap-4 px-8 py-8 md:py-16">
        <div className="flex flex-col justify-center items-center gap-4 lg:border-green-500 p-8 lg:border-r-2 w-full lg:w-[20vw]">
          <div
            className="flex justify-center items-center border-4 border-green-500 rounded-full w-[125px] h-[125px] overflow-hidden"
          >
            <img
              className="min-w-[125px] min-h-[125px]"
              src={
                userData.image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Your avatar"
            />
          </div>
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center w-fit md:text-lg hover:cursor-pointer">
                <p className="font-medium text-xs md:text-sm">Edit avatar</p>{" "}
                <CiEdit />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <h2 className="font-semibold text-center text-md">
                Select an image:
              </h2>
              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => onSubmitPicture(e)}
              >
                {imageError && (
                  <p className="w-full text-center text-red-600 text-sm">
                    {imageError}
                  </p>
                )}
                <Input
                  type="file"
                  className="h-10"
                  onChange={(e) =>
                    e.target.files && setImageSelected(e.target.files[0])
                  }
                />
                <Button
                  type="submit"
                  className="mx-auto rounded-md w-2/3 h-fit text-sm"
                  disabled={!imageSelected ? true : false}
                >
                  {imageLoading ? (
                    <>
                      Loading <LoadingSVG />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
                <PopoverClose
                  disabled={!imageSelected ? true : false}
                  className="text-sm disabled:text-neutral-300"
                >
                  <p onClick={() => setImageSelected(null)}>Cancel</p>
                </PopoverClose>
              </form>
            </PopoverContent>
          </Popover>
        </div>
        <form
          className="flex flex-col gap-4 mb-8 w-full lg:w-4/5 scale-[0.95] md:scale-100"
          onFocus={() => setEditing(true)}
          onSubmit={handleSubmit(onSubmitData)}
        >
          <h2 className="font-semibold text-2xl text-center">Personal data</h2>

          <p className="text-red-600 text-sm">{errors.username?.message}</p>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="username">Your username</Label>
            <Input
              disabled={userData.username !== ""}
              placeholder="your-username"
              id="username"
              {...register("username", {
                required: userData.username === "",
                pattern: {
                  value: /^[^@\s]+$/,
                  message:
                    "Your username can't contain white whitespace(s) or @",
                },
              })}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="name">Your name</Label>
            <Input
              placeholder="Your Name"
              id="name"
              {...register("name", {
                required: userData.name === "",
              })}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="email">Your email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register("email", {
                required: userData.email === "",
                pattern: {
                  value: /^[^\s@]+@[^\s.]+\.[^\s]+$/,
                  message:
                    "Your email must match the example: example@email.com",
                },
              })}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="address">Your address</Label>
            <Input
              id="address"
              placeholder="Your address"
              {...register("address", {
                required: userData.address === "",
              })}
            />
          </div>
          <Button disabled={!editing} type="submit" className="mx-auto w-2/5">
            {formLoading ? (
              <>
                Loading <LoadingSVG />
              </>
            ) : (
              "Save changes"
            )}
          </Button>
          <Button
            className="mx-auto w-2/5"
            disabled={!editing}
            variant="tertiary"
            type="button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}
