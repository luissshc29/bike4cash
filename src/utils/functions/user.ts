import { UserDataType } from "@/app/user/page";
import { bikes } from "@/assets/bikes";
import { Session } from "next-auth";
import { ITransaction } from "../types/ITransaction";

export async function getUserData(session: {
    data: Session;
    status: "authenticated" | "loading" | "unauthenticated";
}) {
    const loginMethod: "provider" | "credentials" = (session.data?.user
        ?.email as string)
        ? "provider"
        : "credentials";
    const res = await fetch(
        `/api/user/get/?search-for=${
            loginMethod === "provider"
                ? session.data?.user?.email
                : session.data?.user?.name
        }`
    );
    const json = await res.json();
    const user: UserDataType & { image?: string } = json.user;
    return user;
}

export async function getUserFavorites(session: {
    data: Session;
    status: "authenticated" | "loading" | "unauthenticated";
}) {
    if (session.status === "authenticated") {
        const username = (await getUserData(session)).username;
        const res = await fetch(
            `/api/user/favorite/get/?search-for=${username}`
        );
        const json: { favorites: { username: string; bikeId: number }[] } =
            await res.json();
        const idArray = json.favorites.map((item) => item.bikeId);

        const favoriteBikesArray: typeof bikes = [];
        for (let i = 0; i < bikes.length; i++) {
            if (idArray.includes(bikes[i].id)) {
                favoriteBikesArray.push(bikes[i]);
            }
        }
        return favoriteBikesArray;
    }
}

export async function getUserTransactions(session: {
    data: Session;
    status: "authenticated" | "loading" | "unauthenticated";
}) {
    if (session.status === "authenticated") {
        const username = (await getUserData(session)).username;
        const res = await fetch(
            `/api/user/transaction/get/?search-for=${username}`
        );
        const json: { transactions: ITransaction[] } = await res.json();

        return json;
    }
}
