import { NextResponse, NextRequest } from "next/server";
import { createBikeRating } from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const RequestBody = await req.json();
    try {
        await createBikeRating(RequestBody);
        return NextResponse.json({ message: "Rating created succesfully!" });
    } catch (error) {
        throw new Error();
    }
}
