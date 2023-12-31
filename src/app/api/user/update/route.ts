import { NextResponse, NextRequest } from "next/server";
import { updateUser } from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const RequestBody = await req.json();
    try {
        await updateUser(RequestBody);
        return NextResponse.json({ message: "User updated succesfully!" });
    } catch (error) {
        throw new Error();
    }
}
