import { NextResponse, NextRequest } from "next/server";
import { createTransaction } from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    const RequestBody = await req.json();
    try {
        await createTransaction(RequestBody);
        return NextResponse.json({
            message: "Transaction created succesfully!",
        });
    } catch (error) {
        throw new Error();
    }
}
