import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { sendResetPasswordEmail } from '@/helpers/sendResetPasswordEmail';
import { ApiResponse } from '@/types/ApiResponse';
import UserModel from '@/models/User';
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        await dbConnect();

        const body = await request.json();
        const parsed = forgotPasswordSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email } = parsed.data;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'No account found with this email address' },
                { status: 404 }
            );
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.resetCode = resetCode;
        user.resetCodeExpiry = resetCodeExpiry;
        await user.save();

        const emailResponse = await sendResetPasswordEmail(email, resetCode);

        if (!emailResponse.success) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'Failed to send password reset email' },
                { status: 502 }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: true, message: 'Password reset code sent to your email' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in forgot-password:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: 'Failed to process forgot password request' },
            { status: 500 }
        );
    }
}
