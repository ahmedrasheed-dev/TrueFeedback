import UserModel from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/models/User';
import { messageSchema } from '@/schemas/messageSchema';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/ApiResponse';

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessages) {
            return NextResponse.json<ApiResponse>(
                { message: 'User is not accepting messages', success: false },
                { status: 403 }
            );
        }


        const newMessage = { content, createdAt: new Date() };
        newMessage.content = newMessage.content.trim();
        const parsedMessage = messageSchema.safeParse(newMessage);

        if (!parsedMessage.success) {
            return NextResponse.json<ApiResponse>(
                { message: 'Invalid message content', success: false },
                { status: 400 }
            );
        }
        user.messages.push(parsedMessage.data as Message);
        await user.save();

        return NextResponse.json<ApiResponse>(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding message:', error);
        return NextResponse.json<ApiResponse>(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}