import { deleteFavorite } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const RequestBody = await req.json();
        const res = await deleteFavorite(RequestBody);
        return NextResponse.json({ message: "Favorite deleted succesfully!" });
    } catch (error) {
        throw new Error();
    }
}
