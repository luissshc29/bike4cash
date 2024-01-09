import { addFavorite } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const RequestBody = await req.json();
        const res = await addFavorite(RequestBody);
        return NextResponse.json({ message: "Favorite added succesfully!" });
    } catch (error) {
        throw new Error();
    }
}
