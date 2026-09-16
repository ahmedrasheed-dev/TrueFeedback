import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    if (request.method !== "POST") {
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Method not allowed" },
            { status: 405 }
        );
    }

    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        const isCodeValid = verifySchema.safeParse({ code });
        if (!isCodeValid.success) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: isCodeValid.error.issues[0].message },
                { status: 400 }
            );
        }

        if (user.verifyCode !== code) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Invalid verification code" },
                { status: 400 }
            );
        }
        if (user.verifyCodeExpiry < new Date()) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Verification code has expired, Please sign up again" },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.verifyCode = "";
        user.verifyCodeExpiry = new Date(0);
        await user.save();
        return NextResponse.json<ApiResponse>(
            { success: true, message: "User verified successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking verification code:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: `Error checking verification code: ${error}` },
            { status: 500 }
        );
    }
}