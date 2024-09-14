import React from "react";

export default function Banner({
  children,
  className = "",
  height,
  ...rest
}: {
  children: React.ReactNode;
  height: string;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <div
      className={`mt-[-1em] px-8 flex flex-col items-center justify-center gap-2 bg-black bg-opacity-40 text-center relative overflow-clip`}
      style={{
        height: `calc(${height} + 1em)`,
      }}
    >
      <img
        className={`z-[-10] absolute min-w-[1024px] ${className}`}
        {...rest}
      />
      <div className="z-10">{children}</div>
    </div>
  );
}
