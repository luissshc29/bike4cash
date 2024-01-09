import { getBikeRatingsById } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const search = Number(url.search.replace("?search-for=", ""));
    try {
        const res = await getBikeRatingsById({ bikeId: search });
        return NextResponse.json({ userbikeRatings: res });
    } catch (error) {
        throw new Error();
    }
}
