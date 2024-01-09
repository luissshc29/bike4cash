import { NextResponse, NextRequest } from "next/server";
import { createUserData } from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const RequestBody = await req.json();
    try {
        await createUserData(RequestBody);
        return NextResponse.json({ message: "User data created succesfully!" });
    } catch (error) {
        throw new Error().message;
    }
}
