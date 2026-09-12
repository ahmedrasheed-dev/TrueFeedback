import { ApiResponse } from "@/types/ApiResponse";
import { transporter } from '@/lib/nodeMailer';
import { render } from '@react-email/render';
import React from 'react';
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(email: string, username: string, otp: string): Promise<ApiResponse> {
    try {
        const html = await render(React.createElement(VerificationEmail, { otp }));

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            replyTo: email,
            subject: 'TrueFeedback Verification Code',
            html,
        };

        // 3. Send the email
        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: "Verification email sent successfully."
        };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return {
            success: false,
            message: "Failed to send verification email."
        };
    }
}