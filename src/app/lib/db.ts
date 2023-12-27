import { PrismaClient } from "@prisma/client";
import { SigninDataType } from "../signin/page";
import { UserDataType } from "../user/page";
export const prisma = new PrismaClient();

export async function getUsers() {
    const users = await prisma.userData.findMany({});
    return users;
}

export async function createUser(
    user: SigninDataType & UserDataType & { image: string }
) {
    try {
        await prisma.userLogin.create({
            data: {
                username: user.username || "",
                password: user.password || "",
            },
        });
        await prisma.userData.create({
            data: {
                username: user.username || "",
                name: user.name || "",
                email: user.email || "",
                address: user.address || "",
                image: user.image || "",
            },
        });
    } catch (error) {
        throw new Error();
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
