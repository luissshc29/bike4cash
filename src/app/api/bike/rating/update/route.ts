import { NextResponse, NextRequest } from "next/server";
import { updateBikeRating } from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const RequestBody = await req.json();
    try {
        await updateBikeRating(RequestBody);
        return NextResponse.json({ message: "Rating updated succesfully!" });
    } catch (error) {
        throw new Error();
    }
}
