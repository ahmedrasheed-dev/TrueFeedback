import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { usernameValidation } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';

const updateUsernameSchema = z.object({
    username: usernameValidation,
});

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json<ApiResponse>({ success: false, message: 'You must be signed in.' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const parsed = updateUsernameSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: parsed.error.issues[0].message },
                { status: 400 },
            );
        }

        await dbConnect();
        const existingUser = await UserModel.findOne({
            username: parsed.data.username,
            _id: { $ne: session.user.id },
        });

        if (existingUser) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'Username is already taken.' },
                { status: 409 },
            );
        }

        await UserModel.findByIdAndUpdate(session.user.id, { username: parsed.data.username });

        return NextResponse.json<ApiResponse>({ success: true, message: 'Username updated successfully.' });
    } catch (error) {
        console.error('Error updating username:', error);
        return NextResponse.json<ApiResponse>({ success: false, message: 'Could not update username.' }, { status: 500 });
    }
}
