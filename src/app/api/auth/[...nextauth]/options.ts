import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? process.env.NEXT_AUTH_SECRET ?? "dev-secret-change-me";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: "Email or Username", type: "text", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await dbConnect();
                try {
                    const identifier = credentials?.identifier?.trim();
                    const userDoc = await UserModel.findOne({
                        $or: [{ email: identifier }, { username: identifier }],
                    });

                    if (!userDoc) {
                        throw new Error("No user found with the provided email or username");
                    }
                    if (!userDoc.isVerified) {
                        throw new Error("User is not verified. Please verify your email before logging in.");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials?.password || "", userDoc.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: userDoc._id.toString(),
                        email: userDoc.email,
                        username: userDoc.username,
                        isVerified: userDoc.isVerified,
                        isAcceptingMessages: userDoc.isAcceptingMessages,
                    };
                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : "An error occurred during authentication");
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: nextAuthSecret,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id ?? user._id?.toString();
                token.isVerified = Boolean(user.isVerified);
                token.isAcceptingMessages = Boolean(user.isAcceptingMessages);
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.isVerified = Boolean(token.isVerified);
                session.user.isAcceptingMessages = Boolean(token.isAcceptingMessages);
                session.user.username = token.username;
            }
            return session;
        }
    }
}