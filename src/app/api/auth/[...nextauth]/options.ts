import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import GoogleProvider from "next-auth/providers/google";
const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? process.env.NEXT_AUTH_SECRET ?? "dev-secret-change-me";

async function createUniqueUsername(seed: string): Promise<string> {
    const baseUsername = seed
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 20) || "user";
    let username = baseUsername;
    let suffix = 1;

    while (await UserModel.exists({ username })) {
        const suffixText = String(suffix++);
        username = `${baseUsername.slice(0, 20 - suffixText.length)}${suffixText}`;
    }

    return username;
}

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
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: nextAuthSecret,
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider !== "google") {
                return true;
            }

            if (!user.email) {
                return "/sign-in?error=GoogleAccountHasNoEmail";
            }

            await dbConnect();
            const email = user.email.toLowerCase();
            const existingUser = await UserModel.findOne({ email });

            if (existingUser) {
                if (!existingUser.isVerified) {
                    existingUser.isVerified = true;
                }
                existingUser.provider = "google";
                existingUser.providerAccountId = account.providerAccountId;
                await existingUser.save();

                user.id = existingUser._id.toString();
                user.username = existingUser.username;
                user.isVerified = true;
                user.isAcceptingMessages = existingUser.isAcceptingMessages;
                return true;
            }

            const emailName = email.split("@")[0];
            const profileName = typeof profile?.name === "string" ? profile.name : emailName;
            const username = await createUniqueUsername(profileName || emailName);
            const randomPassword = await bcrypt.hash(randomBytes(32).toString("hex"), 10);
            const newUser = await UserModel.create({
                username,
                email,
                password: randomPassword,
                provider: "google",
                providerAccountId: account.providerAccountId,
                isAcceptingMessages: true,
                isVerified: true,
                messages: [],
            });

            user.id = newUser._id.toString();
            user.username = newUser.username;
            user.isVerified = true;
            user.isAcceptingMessages = true;
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session?.user?.username) {
                token.username = session.user.username;
            }

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