import { NextResponse, NextRequest } from "next/server";
import { createUserLogin } from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const RequestBody = await req.json();
    try {
        createUserLogin(RequestBody);
        return NextResponse.json({
            message: "User login created succesfully!",
        });
    } catch (error) {
        throw new Error().message;
    }
}
