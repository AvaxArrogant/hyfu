# HyperFueled Project Setup & Backend Requirements

This document outlines the backend functionality and future features required to make the HyperFueled landing page fully operational. The current implementation is a frontend prototype; the features listed below will require backend development.

## 1. User & Referral Database

A database (e.g., Firebase Firestore, Supabase, or any other SQL/NoSQL solution) is required to store user information and track referrals.

### Schema Requirements:

*   **Users Table:**
    *   `userId` (Primary Key, unique)
    *   `email` (string)
    *   `walletAddress` (string, unique, indexed) - The primary identifier for users.
    *   `referralCode` (string, unique, indexed)
    *   `referredBy` (string, foreign key to another user's `referralCode`)
    *   `createdAt` (timestamp)

*   **Invites Table:**
    *   `inviteId` (Primary Key, unique)
    *   `inviterWallet` (string, foreign key to `Users.walletAddress`)
    *   `inviteeEmail` (string) - The email of the person who was invited.
    *   `status` (enum: 'pending', 'signed_up')
    *   `createdAt` (timestamp)

## 2. Backend API / Edge Functions

A serverless backend (e.g., Firebase Functions, Supabase Edge Functions, Vercel Serverless Functions) is needed to handle business logic securely.

### Required Endpoints:

*   **`POST /api/signup`**:
    *   **Action:** Handles new user email submissions.
    *   **Input:** `{ email: string, referredByCode?: string }`
    *   **Logic:**
        1.  Validate the email format.
        2.  Check if the email already exists.
        3.  If `referredByCode` is present, validate it and record the referral.
        4.  Create a new user entry in the database with a 'pending' status for wallet connection.
    *   **Returns:** Success or error message.

*   **`POST /api/connect-wallet`**:
    *   **Action:** Associates a wallet address with a user's email and generates their unique referral code.
    *   **Input:** `{ email: string, walletAddress: string }`
    *   **Logic:**
        1.  Verify the user owns the wallet address (e.g., via signature verification).
        2.  Find the user by email.
        3.  Update the user's record with their `walletAddress`.
        4.  Generate a unique `referralCode` and save it to the user's record.
        5.  If the user was referred, update the corresponding invite status to 'signed_up'.
    *   **Returns:** `{ referralCode: string }`

*   **`GET /api/leaderboard`**:
    *   **Action:** Retrieves the top referrers.
    *   **Logic:**
        1.  Query the database to count the number of successful signups ('signed_up' status) for each `inviterWallet`.
        2.  Aggregate the data, rank users, and return the top 10.
    *   **Returns:** An array of leaderboard objects: `[{ rank: number, address: string, invites: number }]`

## 3. Admin Dashboard (`/hyper-admin`)

The current admin dashboard is a client-side prototype. A production implementation requires:

*   **Secure Authentication:** The hardcoded password (`iamhyperfueled`) must be replaced with a secure authentication system (e.g., Firebase Auth, Auth0, or a custom solution with JWTs). Access should be role-based.
*   **Data Fetching:** The dashboard should fetch live data from the backend API instead of using mock data.
    *   `GET /api/admin/stats`: Returns `totalSignups`, `totalInvites`, `conversionRate`.
    *   `GET /api/admin/referrers`: Returns a list of all referrers and their stats.

## 4. Future Feature Considerations

*   **ENS Integration:** Use a library like `ethers.js` or `viem` to resolve ENS names for wallet addresses to display them on the leaderboard and in the admin panel.
*   **Social Sharing Metadata:** Enhance the `Share` functionality to include rich metadata (e.g., Open Graph tags) for platforms like Twitter and Facebook, making shared links more appealing.
*   **Email Service:** Integrate with an email service (e.g., SendGrid, Mailgun) to send confirmation emails upon signup and notifications for successful referrals.
*   **Web3 Wallet Connection:** Replace the mocked connection with a real Web3 wallet connection library like `wagmi`, `web3-modal`, or `rainbowkit` to handle interactions with user wallets (e.g., MetaMask, WalletConnect).
