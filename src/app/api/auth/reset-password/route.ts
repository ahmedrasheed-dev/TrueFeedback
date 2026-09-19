import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/ApiResponse';
import UserModel from '@/models/User';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        await dbConnect();

        const body = await request.json();
        const parsed = resetPasswordSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email, code, password } = parsed.data;

        const user = await UserModel.findOne({
            email,
            resetCode: code,
            resetCodeExpiry: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'Invalid or expired reset code' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetCode = '';
        user.resetCodeExpiry = null as unknown as Date;
        await user.save();

        return NextResponse.json<ApiResponse>(
            { success: true, message: 'Password reset successfully! Please sign in with your new password.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: 'Failed to reset password' },
            { status: 500 }
        );
    }
}
