import { NextResponse, NextRequest } from "next/server";
import { getUsers } from "@/app/lib/db";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const res = await getUsers();
        return NextResponse.json({
            users: res,
        });
    } catch (error) {
        throw new Error();
    }
}
