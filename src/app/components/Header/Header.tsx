"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/shadcnui/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/shadcnui/components/ui/dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/app/shadcnui/components/ui/menubar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/app/shadcnui/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdMenuOpen } from "react-icons/md";
import Button from "../Button/Button";
import { DialogClose } from "@radix-ui/react-dialog";
import LoadingSVG from "@/utils/svg/LoadingSVG";
import { gql, useQuery } from "@apollo/client";
import { ICategory } from "@/utils/types/ICategory";

export default function Header() {
  const session = useSession();
  const [loadingLogout, setLoadingLogout] = useState<boolean>(false);

  async function logOut() {
    try {
      setLoadingLogout(true);
      await signOut();
    } catch (error) {
      throw new Error();
    }
    setLoadingLogout(false);
  }

  const BIKE_CATEGORIES_QUERY = gql`
    #graphql
    query categories {
      categories {
        id
        name
      }
    }
  `;

  const { data, loading, error, refetch } = useQuery(BIKE_CATEGORIES_QUERY);

  if (!loading && !loadingLogout) {
    return (
      <header className="relative z-10 flex justify-around items-center bg-white shadow-lg shadow-neutral-300 py-8 rounded-b-xl w-screen h-[20vh]">
        <Link
          href="/"
          className="flex justify-center items-center gap-2 md:gap-4 w-[50vw] md:w-[30vw]"
        >
          <img src="/logo.png" className="w-1/5 md:w-1/4" />
          <h1 className="font-extrabold text-xl md:text-3xl">
            Bike<span className="text-green-500">4Cash</span>
          </h1>
        </Link>
        <Menubar className="md:flex flex-row-reverse justify-evenly hidden w-fit">
          <MenubarMenu>
            {session.data ? (
              <>
                <MenubarTrigger className="text-2xl hover:cursor-pointer">
                  <FaRegCircleUser />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Link href="/user">My profile</Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Link href="/user/favorites">My favorites</Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Link href="/user/rental-history">My rental history</Link>
                  </MenubarItem>
                  <Dialog>
                    <DialogTrigger
                      asChild
                      className="px-2 py-1 font-semibold text-red-600 text-sm hover:cursor-pointer"
                    >
                      <p>Logout</p>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-bold text-red-600 text-xl">
                          Sign out
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to logout from your account?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          className="bg-red-600 rounded-md"
                          disabled={loading}
                          onClick={() => logOut()}
                        >
                          {loading ? (
                            <>
                              Loading <LoadingSVG />
                            </>
                          ) : (
                            "Sign out"
                          )}
                        </Button>
                        <DialogClose>
                          <p className="font-semibold text-red-600">Cancel</p>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </MenubarContent>
              </>
            ) : (
              <Link
                href={"/api/auth/signin"}
                className="px-4 font-semibold text-green-500 text-md"
              >
                Sign in
              </Link>
            )}
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="font-semibold text-md">
              About us
            </MenubarTrigger>
            <MenubarContent className="flex flex-wrap gap-2 p-3 max-w-[25vw] lg:max-w-[40vw] text-xs lg:text-sm">
              <img
                className="rounded-sm"
                src="/about-us-header.jpg"
                alt="Person cycling"
              />
              <p className="">
                Welcome to Bike4Cash, where your cycling adventure begins! At
                Bike4Cash, we're passionate about providing you with top-quality
                bicycles to elevate your riding experience.{" "}
                <Link href="/about" className="text-xs underline">
                  Read more
                </Link>
              </p>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="font-semibold text-md">
              Our bikes
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link
                  href={`/bikes/?category=recommended`}
                  className="w-full text-sm"
                >
                  Recommended
                </Link>
              </MenubarItem>
              {data.categories?.map((item: ICategory) => (
                <MenubarItem key={item.id}>
                  <Link
                    href={`/bikes/?category=${item.name.toLowerCase()}`}
                    className="w-full text-sm"
                  >
                    {item.name}
                  </Link>
                </MenubarItem>
              ))}
              <MenubarItem>
                <Link href="/bikes/?category=all" className="w-full text-sm">
                  All models
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Sheet>
          <SheetTrigger className="md:hidden text-2xl text-neutral-800">
            <MdMenuOpen />
          </SheetTrigger>
          <SheetContent className="py-10">
            <div className="mb-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="font-bold text-md">
                    Our bikes
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col gap-3">
                      <li>
                        <Link
                          href="/bikes/?category=recommended"
                          className="text-sm"
                        >
                          Recommended
                        </Link>
                      </li>
                      {data.categories?.map((item: ICategory) => (
                        <li key={item.id}>
                          <Link
                            href={`/bikes/?category=${item.name.toLowerCase()}`}
                            className="text-sm"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}

                      <li>
                        <Link href="/bikes/?category=all">All models</Link>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="font-bold text-md">
                    About us
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-wrap gap-2 p-3 text-xs lg:text-sm">
                    <img src="/about-us-header.jpg" alt="Person cycling" />
                    <p className="">
                      Welcome to Bike4Cash, where your cycling adventure begins!
                      At Bike4Cash, we're passionate about providing you with
                      top-quality bicycles to elevate your riding experience.{" "}
                      <Link href="/about" className="text-xs underline">
                        Read more
                      </Link>
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {session.data && (
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-bold text-md">
                      User area
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col gap-3 font-semibold text-md">
                        <li>
                          <Link href="/user">My profile</Link>
                        </li>
                        <li>
                          <Link href="/user/favorites">My favorites</Link>
                        </li>
                        <li>
                          <Link href="/user/rental-history">
                            My rental history
                          </Link>
                        </li>
                        <li>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="text-red-600">Logout</button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="font-bold text-red-600 text-xl">
                                  Sign out
                                </DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to logout from your
                                  account?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  className="bg-red-600 rounded-md"
                                  onClick={() => signOut()}
                                >
                                  Sign out
                                </Button>
                                <DialogClose>
                                  <Button
                                    variant="tertiary"
                                    className="font-semibold text-red-600"
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
            {!session.data && (
              <SheetClose>
                <Link
                  href={"/api/auth/signin"}
                  className="font-semibold text-green-500"
                >
                  Sign in
                </Link>
              </SheetClose>
            )}
          </SheetContent>
        </Sheet>
      </header>
    );
  }
}
