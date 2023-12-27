import Link from "next/link";
import React from "react";

interface ButtonProps {
    variant?: "primary" | "secondary" | "tertiary";
    link?: boolean;
    href?: string;
    children: React.ReactNode;
}

function getVariant(variant: "primary" | "secondary" | "tertiary") {
    switch (variant) {
        case "primary":
            return "px-4 py-2 bg-green-500 disabled:bg-neutral-300 disabled:text-neutral-400 disabled:shadow-none md:px-6 md:py-3 shadow-md shadow-neutral-400 text-white text-sm md:text-md duration-300 enabled:hover:scale-105";
        case "secondary":
            return "px-3 py-1 border-4 border-green-500 disabled:border-neutral-400 disabled:text-neutral-400 text-center text-green-600 font-semibold";
        case "tertiary":
            return "text-green-500 enabled:hover:cursor-pointer disabled:text-neutral-300";
    }
}

export default function Button({
    variant = "primary",
    link = false,
    href = "/",
    children,
    className = "",
    ...rest
}: ButtonProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <>
            {link ? (
                <Link
                    href={href}
                    className={`flex w-fit items-center justify-center justify-items-center gap-2 ${getVariant(
                        variant
                    )} ${className}`}
                    {...rest}
                >
                    {children}
                </Link>
            ) : (
                <button
                    className={`flex w-fit items-center justify-center justify-items-center gap-2 ${getVariant(
                        variant
                    )} ${className}`}
                    {...rest}
                >
                    {children}
                </button>
            )}
        </>
    );
}
