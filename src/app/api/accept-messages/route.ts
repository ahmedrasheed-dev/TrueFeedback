import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    await dbConnect();

    try {
        const userID = session.user.id;
        const user = await UserModel.findById(userID);
        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const { acceptMessages } = await request.json();

        user.isAcceptingMessages = acceptMessages;
        const updatedUser = await user.save();
        if (!updatedUser) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Failed to update messages acceptance" },
                { status: 500 }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: true, message: "Messages acceptance updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating messages acceptance:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Internal server error" }
            , { status: 500 }
        );
    }
}

export async function GET(request: Request): Promise<NextResponse<ApiResponse>> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }
    try {
        const userID = session.user.id;
        const user = await UserModel.findById(userID);

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json<ApiResponse>(
            { success: true, message: "User data fetched successfully", data: { isAcceptingMessages: user.isAcceptingMessages } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }

}