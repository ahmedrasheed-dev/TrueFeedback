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
  - Delete individual messages from the dashboard.
- **Theme Support**: Integrated dark/light mode toggle embedded in top navigation headers.
- **Responsive & Clean UI**: Designed without unwanted scrollbar overflows across viewports.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack) & React 19
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: NextAuth.js v4 (Credentials & Google OAuth provider)
- **Styling**: Tailwind CSS v4, Lucide icons, custom responsive CSS design
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

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB instance (local or MongoDB Atlas connection string)
- SMTP email credentials or Resend API configuration

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmedrasheed-dev/TrueFeedback.git
   cd TrueFeedback
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and define the following variables:
   ```env
   # Database
   MONGODB_URI="your-mongodb-connection-string"

   # NextAuth
   NEXTAUTH_SECRET="your-random-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"

   # Email Service (Nodemailer / SMTP)
   EMAIL_USER="your-email@example.com"
   EMAIL_PASS="your-email-app-password"

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # AI Integration (Optional)
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
   GEMINI_MODEL="gemini-1.5-flash"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## License

This project is open source under the MIT License.
