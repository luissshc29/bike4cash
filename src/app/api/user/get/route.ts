import { NextResponse, NextRequest } from "next/server";
import { getUser } from "@/app/lib/db";

export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const search = url.search.replace("?search-for=", "");
    try {
        const res = await getUser({ search: search });
        return NextResponse.json({
            user: res,
        });
    } catch (error) {
        throw new Error();
    }
}
