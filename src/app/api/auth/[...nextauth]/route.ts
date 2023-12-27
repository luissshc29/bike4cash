import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "@/app/lib/db";

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID as string,
            clientSecret: process.env.FACEBOOK_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Your username",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Your password",
                },
            },
            async authorize(credentials, req) {
                const user = await prisma.userLogin.findUnique({
                    where: {
                        username: credentials?.username,
                        password: credentials?.password,
                    },
                });
                if (user) {
                    return {
                        id: user.id.toString(),
                        name: user.username,
                        password: user.password,
                    };
                } else {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/signin",
    },
});

export { handler as GET, handler as POST };
