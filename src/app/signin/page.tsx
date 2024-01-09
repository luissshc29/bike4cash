"use client";

import React, { useEffect, useState } from "react";
import Button from "../components/Button/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import { Input } from "../shadcnui/components/ui/input";
import LoadingSVG from "@/utils/svg/LoadingSVG";

export type SigninDataType = {
    username: string;
    password: string;
};

type SignupDataType = {
    newUsername: string;
    newPassword: string;
    repeatPassword: string;
};

export default function SigninPage() {
    let redirectUrl = "";
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        document.title = "Bike4Cash | Sign in";
        const url = new URL(location.href);
        redirectUrl = url.searchParams.get("callbackUrl")!;
        console.log(redirectUrl);
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SigninDataType & SignupDataType>();

    const onSignin: SubmitHandler<SigninDataType> = async (data) => {
        try {
            setLoading(true);
            const res = await signIn("credentials", {
                username: data.username,
                password: data.password,
                callbackUrl: redirectUrl,
            });
            if (res?.ok) {
            } else {
                setError("Wrong username and/or password!");
                throw new Error();
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        reset();
    };

    const onSignup: SubmitHandler<SignupDataType> = async (data) => {
        setLoading(true);
        const newData = {
            username: data.newUsername,
            password: data.newPassword,
        };
        if (data.newPassword !== data.repeatPassword) {
            setError("The passwords don't match!");
            setTimeout(() => {
                setError("");
            }, 7000);
        } else {
            try {
                const res = await fetch("/api/user/create", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(newData),
                });
                if (res.ok) {
                    signIn("credentials", {
                        username: newData.username,
                        password: newData.password,
                        callbackUrl: redirectUrl,
                    });
                    reset();
                } else {
                    throw new Error();
                }
            } catch (error) {
                setError("User already exists!");
                setTimeout(() => {
                    setError("");
                }, 7000);
            }
        }
        setLoading(false);
    };

    async function providerAuth(provider: LiteralUnion<BuiltInProviderType>) {
        try {
            setLoading(true);
            const res = await signIn(provider, {
                callbackUrl: redirectUrl,
            });
            if (res?.ok) {
            } else {
                setError("Couldn't authenticate this user!");
                throw new Error();
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const [error, setError] = useState<string>();
    const [mode, setMode] = useState<"signin" | "signup">("signin");

    return (
        <div className="w-[90vw] mx-auto flex flex-col [@media(min-width:740px)]:flex-row justify-center py-8 pb-16 gap-2">
            {mode === "signin" ? (
                <form
                    className="flex w-full h-full flex-col justify-center items-center gap-4 border-4 border-green-500 py-8 px-4 shadow-lg shadow-neutral-400 [@media(min-width:740px)]:animate-content-bottom transition-all duration-350 overflow-hidden"
                    onSubmit={handleSubmit(onSignin)}
                >
                    <h2 className="text-3xl font-bold text-green-500">
                        Sign in
                    </h2>
                    <p className="mb-6 text-sm text-neutral-600">
                        Sign in to access your account
                    </p>
                    <p className="text-sm text-red-600">
                        {errors.username?.message}
                    </p>
                    <Input
                        type="text"
                        placeholder="Your username"
                        className="md:w-3/5"
                        {...register("username", {
                            required: true,
                            pattern: {
                                value: /^\S+$/,
                                message:
                                    "Your username can't contain white whitespace(s)",
                            },
                        })}
                    />
                    <Input
                        type="password"
                        placeholder="Your password"
                        className="md:w-3/5"
                        {...register("password", { required: true })}
                    />
                    <p className="text-[12px] flex gap-1 w-full md:w-3/5">
                        Forgot your password?
                        <Button
                            link={true}
                            href="/password-recovery"
                            variant="tertiary"
                            className="underline"
                            type="button"
                        >
                            Click here
                        </Button>
                    </p>
                    <Button
                        className="w-[30vh] rounded-xl flex gap-2"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                Loading <LoadingSVG />
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                    <div className="flex gap-2 w-full justify-center">
                        <button
                            onClick={() => providerAuth("google")}
                            type="button"
                            className="w-fit bg-white dark:bg-gray-900 border border-gray-300 rounded-full shadow-md p-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 duration-200"
                        >
                            <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                width="800px"
                                height="800px"
                                viewBox="-0.5 0 48 48"
                                version="1.1"
                            >
                                {" "}
                                <title>Google-color</title>{" "}
                                <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                                <g
                                    id="Icons"
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="none"
                                    fillRule="evenodd"
                                >
                                    {" "}
                                    <g
                                        id="Color-"
                                        transform="translate(-401.000000, -860.000000)"
                                    >
                                        {" "}
                                        <g
                                            id="Google"
                                            transform="translate(401.000000, 860.000000)"
                                        >
                                            {" "}
                                            <path
                                                d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                                                id="Fill-1"
                                                fill="#FBBC05"
                                            >
                                                {" "}
                                            </path>{" "}
                                            <path
                                                d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                                                id="Fill-2"
                                                fill="#EB4335"
                                            >
                                                {" "}
                                            </path>{" "}
                                            <path
                                                d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                                                id="Fill-3"
                                                fill="#34A853"
                                            >
                                                {" "}
                                            </path>{" "}
                                            <path
                                                d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                                                id="Fill-4"
                                                fill="#4285F4"
                                            >
                                                {" "}
                                            </path>{" "}
                                        </g>{" "}
                                    </g>{" "}
                                </g>{" "}
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => providerAuth("facebook")}
                            className="w-fit p-2 max-w-md flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 1792 1792"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path>
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => providerAuth("github")}
                            className="p-2 w-fit flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 1792 1792"
                            >
                                <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                            </svg>
                        </button>
                    </div>
                    <p className="text-[13px] flex gap-1 w-fit">
                        Don't have an account?
                        <Button
                            variant="tertiary"
                            className="underline"
                            type="button"
                            onClick={() => {
                                reset();
                                setMode("signup");
                            }}
                        >
                            Click here
                        </Button>
                    </p>
                </form>
            ) : (
                <form
                    className="flex w-full h-full flex-col justify-center items-center gap-4 border-4 border-green-500 py-8 px-4 shadow-lg shadow-neutral-400 animate-content-right [@media(min-width:740px)]:animate-content-bottom transition-all duration-350 overflow-hidden"
                    onSubmit={handleSubmit(onSignup)}
                >
                    <h2 className="text-3xl font-bold text-green-500">
                        Sign up
                    </h2>
                    <p className="mb-6 text-sm text-neutral-600">
                        Join us today!
                    </p>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {errors && (
                        <p className="text-sm text-red-600">
                            {errors.newUsername?.message}
                        </p>
                    )}
                    <Input
                        type="text"
                        placeholder="Your username"
                        className="md:w-3/5"
                        {...register("newUsername", {
                            required: true,
                            pattern: {
                                value: /^\S+$/,
                                message:
                                    "Your username can't contain white whitespace(s)",
                            },
                        })}
                    />
                    <Input
                        type="password"
                        placeholder="Your password"
                        className="md:w-3/5"
                        {...register("newPassword", { required: true })}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm your password"
                        className="md:w-3/5"
                        {...register("repeatPassword", { required: true })}
                    />
                    <Button
                        className="w-[30vh] rounded-xl flex gap-2 justify-center"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                Loading <LoadingSVG />
                            </>
                        ) : (
                            "Sign up"
                        )}
                    </Button>
                    <Button
                        variant="tertiary"
                        className="text-sm font-semibold"
                        onClick={() => {
                            reset();
                            setMode("signin");
                        }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </form>
            )}
        </div>
    );
}
