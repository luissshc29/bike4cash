import EmailTemplate from "@/app/components/EmailTemplate/EmailTemplate";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const RequestBody = await req.json();
        const { data, error } = await resend.emails.send({
            from: "<Bike4Cash - Support Team> luishcc2003@gmail.com",
            to: [RequestBody.email],
            subject: "Bike4Cash - Password recovery",
            react: EmailTemplate({
                email: RequestBody.email,
            }) as React.ReactElement,
        });
        if (error) {
            throw new Error(JSON.stringify(error));
        }
        return NextResponse.json({ message: "Email sent successfuly!" });
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}
