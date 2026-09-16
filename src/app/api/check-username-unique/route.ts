import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: NextRequest) {
    if (request.method !== "GET") {
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Method not allowed" },
            { status: 405 }
        );
    }
    await dbConnect();

    try {
        const searchParams = request.nextUrl.searchParams;
        const usernameParam = searchParams.get("username");

        const parsed = UsernameQuerySchema.safeParse({ username: usernameParam });
        if (!parsed.success) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: parsed.error.issues[0].message },
                { status: 400 }
            );
        }
        const username = parsed.data.username;

        const existingUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        return NextResponse.json<ApiResponse>({
            success: true,
            message: existingUser ? "Username is taken" : "Username is available",
        });
    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: `Error checking username uniqueness: ${error}` },
            { status: 500 }
        );
    }
}