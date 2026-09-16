import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: Request): Promise<NextResponse<ApiResponse>> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }
    const userID = new mongoose.Types.ObjectId(session.user.id);
    await dbConnect();
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userID } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            {
                $group: { _id: "$_id", messages: { $push: "$messages" } }
            },
        ]);
        if (!user || user.length === 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json<ApiResponse>(
            { success: true, message: "Messages fetched successfully", data: user[0].messages },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }

}