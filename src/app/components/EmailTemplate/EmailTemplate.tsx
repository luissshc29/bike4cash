import React from "react";

export default function EmailTemplate({ email }: { email: string }) {
  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        height: "50vh",
        border: "4px solid rgb(34, 197, 94)",
        padding: "32px",
        margin: "48px auto",
      }}
    >
      <h1
        style={{
          fontSize: "30px",
          lineHeight: "35px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        Hello, user!
      </h1>
      <p
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "black",
        }}
      >
        Click the link below to redefine the password for{" "}
        <span
          style={{
            color: "rgb(34, 197, 94)",
            textDecoration: "underline",
          }}
        >
          {email}
        </span>
      </p>
      <a
        href="/"
        style={{
          backgroundColor: "rgb(34, 197, 94)",
          padding: "1em 0.5em",
          color: "white",
        }}
      >
        Click here
      </a>
    </div>
  );
}
