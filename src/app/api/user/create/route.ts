import { NextResponse, NextRequest } from "next/server";
import { createUser } from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const RequestBody = await req.json();
    try {
        createUser(RequestBody);
        return NextResponse.json({ message: "User created succesfully!" });
    } catch (error) {
        throw new Error();
    }
}
