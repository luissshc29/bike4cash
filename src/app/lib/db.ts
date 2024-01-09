import { PrismaClient } from "@prisma/client";
import { SigninDataType } from "../signin/page";
import { UserDataType } from "../user/page";
import { ITransaction } from "@/utils/types/ITransaction";
import { IRating } from "@/utils/types/IRating";
export const prisma = new PrismaClient();

export async function getUser(data: { search: string }) {
    const identifier = data.search.includes("%40")
        ? {
              email: data.search.replace("%40", "@"),
          }
        : {
              username: data.search,
          };
    const user = await prisma.userData.findUnique({
        where: identifier,
    });
    return user;
}

// User's data
export async function createUserLogin(user: SigninDataType) {
    try {
        await prisma.userLogin.create({
            data: {
                username: user.username || "",
                password: user.password || "",
            },
        });
    } catch (error) {
        throw new Error().message;
    }
}

export async function createUserData(user: UserDataType & { image: string }) {
    try {
        await prisma.userData.create({
            data: {
                ...user,
            },
        });
    } catch (error) {
        throw new Error().message;
    }
}

export async function updateUser(user: UserDataType) {
    try {
        await prisma.userData.update({
            where: {
                username: user.username,
            },
            data: {
                ...user,
            },
        });
    } catch (error) {
        throw new Error();
    }
}

export async function updateUserImage(data: { url: string; username: string }) {
    console.log(data);
    try {
        await prisma.userData.update({
            where: {
                username: data.username,
            },
            data: {
                image: data.url,
            },
        });
    } catch (error) {
        throw new Error();
    }
}

// User's favorites
export async function addFavorite(data: { username: string; bikeId: number }) {
    try {
        await prisma.userFavorites.create({
            data: {
                username: data.username,
                bikeId: data.bikeId,
            },
        });
    } catch (error) {
        throw new Error();
    }
}

export async function deleteFavorite(data: {
    username: string;
    bikeId: number;
}) {
    try {
        await prisma.userFavorites.deleteMany({
            where: {
                username: data.username,
                bikeId: data.bikeId,
            },
        });
    } catch (error) {
        throw new Error();
    }
}

export async function getFavorites(data: { username: string }) {
    try {
        const favorites = await prisma.userFavorites.findMany({
            where: {
                username: data.username,
            },
        });
        return favorites;
    } catch (error) {
        throw new Error();
    }
}

// User's transactions
export async function getUserTransactions(data: { username: string }) {
    try {
        const userTransactions = await prisma.userTransactions.findMany({
            where: {
                username: data.username,
            },
        });
        return userTransactions;
    } catch (error) {
        throw new Error();
    }
}

export async function createTransaction(data: ITransaction) {
    try {
        await prisma.userTransactions.create({
            data: {
                username: data.username,
                bikeId: data.bikeId,
                finalDate: data.finalDate,
                initialDate: data.initialDate,
                paymentMethod: data.paymentMethod,
                installments: data.installments,
                totalPrice: data.totalPrice,
                transactionDate: data.transactionDate,
            },
        });
    } catch (error) {
        throw new Error();
    }
}

// Bike Ratings

/* Filtering by Username */

export async function getBikeRatingsByUser(data: { username: string }) {
    try {
        const bikeRatingsByUser = await prisma.bikeRatings.findMany({
            where: {
                username: data.username,
            },
        });
        return bikeRatingsByUser;
    } catch (error) {
        throw new Error();
    }
}

/* Filtering by Bike ID */

export async function getBikeRatingsById(data: { bikeId: number }) {
    try {
        const bikeRatingsById = await prisma.bikeRatings.findMany({
            where: {
                bikeId: data.bikeId,
            },
        });
        return bikeRatingsById;
    } catch (error) {
        throw new Error();
    }
}

export async function createBikeRating(data: IRating) {
    try {
        await prisma.bikeRatings.create({
            data: {
                username: data.username,
                bikeId: data.bikeId,
                rating: data.rating,
                message: data.message,
            },
        });
    } catch (error) {
        throw new Error();
    }
}

export async function updateBikeRating(data: IRating) {
    try {
        await prisma.bikeRatings.updateMany({
            where: {
                username: data.username,
                bikeId: data.bikeId,
            },
            data: {
                rating: data.rating,
                message: data.message,
            },
        });
    } catch (error) {
        throw new Error();
    }
}
