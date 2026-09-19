import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    context: { params: Promise<{ messageid: string }> }
): Promise<NextResponse<ApiResponse>> {
    const { messageid } = await context.params;
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: session.user.id },
            { $pull: { messages: { _id: messageid } } }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Message not found or already deleted" },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Error deleting message" },
            { status: 500 }
        );
    }
}
