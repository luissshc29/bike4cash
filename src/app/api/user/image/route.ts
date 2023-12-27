import { updateUserImage } from "@/app/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const RequestBody = await req.json();
    try {
        await updateUserImage(RequestBody);
        return NextResponse.json({ message: "Avatar updated succesfully!" });
    } catch (error) {
        throw new Error();
    }
}
