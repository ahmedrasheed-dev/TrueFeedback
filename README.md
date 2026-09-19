# TrueFeedback

An anonymous feedback web application built with Next.js, MongoDB, and TypeScript. TrueFeedback allows users to share a personalized link, receive honest feedback privately, control whether they want to accept new messages, and reset forgotten account passwords via email OTP verification.

**Live Application**: [https://true-feedback-tau-indol.vercel.app/](https://true-feedback-tau-indol.vercel.app/)

---

## Features

- **Anonymous Message Delivery**: Anyone with a user's link can send feedback without needing an account.
- **Message Acceptance Toggle**: Users can turn message intake on or off anytime directly from their dashboard.
- **AI Suggested Messages**: Integrated prompt generator to suggest constructive questions for message senders.
- **Account Security**:
  - Email OTP verification for new accounts.
  - Email 6-digit code flow for password resets (`/forgot-password` & `/reset-password`).
  - NextAuth.js authentication supporting both credentials and Google OAuth.
- **Dashboard Management**:
  - Live feedback stream with real-time refresh options.

---

## Tech Stack

- **Framework**: Next.js 16  & React 19
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: NextAuth (Credentials & Google OAuth provider)
- **Form Validation**: React Hook Form + Zod validation schemas
- **Email Service**: React Email & Nodemailer (SMTP / custom transport)
- **AI Engine**: Vercel AI SDK (`@ai-sdk/google`, `@ai-sdk/openai`, `@ai-sdk/groq`)

---

## Project Structure

```text
├── emails/                         # React Email templates (Verification & Password Reset)
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Sign in, Sign up, Forgot Password, Reset Password
│   │   ├── api/                    # REST endpoints (auth, messaging, profile, suggestions)
│   │   ├── dashboard/              # User dashboard & message controls
│   │   ├── u/[username]/           # Public anonymous message input page
│   │   └── verify/[username]/      # Account OTP verification page
│   ├── components/                 # Reusable UI components & Theme Toggle
│   ├── helpers/                    # Email dispatch utilities
│   ├── lib/                        # Database connection singletons
│   ├── models/                     # Mongoose schemas (User & Message)
│   └── schemas/                    # Zod validation schemas
└── public/                         # Static assets
```

## License

This project is open source under the MIT License.
