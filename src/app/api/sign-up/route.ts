import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';
import UserModel from '@/models/User';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        await dbConnect();

        const { email, username, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });
        if (existingUserVerifiedByUsername) {
            return NextResponse.json<ApiResponse>({ success: false, message: 'Username already exists' }, { status: 400 });
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json<ApiResponse>({ success: false, message: 'Email already exists' }, { status: 400 });
            } else {
                const hasedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessages: true,
                isVerified: false,
                messages: [],
            });
            await newUser.save();

            const emailResponse = await sendVerificationEmail(email, username, verifyCode);
            if (!emailResponse.success) {
                return NextResponse.json<ApiResponse>(
                    { success: false, message: 'Could not send verification email' },
                    { status: 502 },
                );
            }

            return NextResponse.json<ApiResponse>(
                { success: true, message: 'User registered successfully, please verify your email' },
                { status: 201 },
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json<ApiResponse>({ success: false, message: 'Failed to sign up' }, { status: 500 });
    }
}
