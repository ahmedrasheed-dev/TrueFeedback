import { ApiResponse } from "@/types/ApiResponse";
import { transporter } from '@/lib/nodeMailer';
import { render } from '@react-email/render';
import React from 'react';
import ResetPasswordEmail from "../../emails/ResetPasswordEmail";

export async function sendResetPasswordEmail(email: string, otp: string): Promise<ApiResponse> {
    try {
        const html = await render(React.createElement(ResetPasswordEmail, { otp }));

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            replyTo: email,
            subject: 'TrueFeedback Password Reset Code',
            html,
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: "Password reset email sent successfully."
        };
    } catch (emailError) {
        console.error("Error sending password reset email:", emailError);
        return {
            success: false,
            message: "Failed to send password reset email."
        };
    }
}
