import NextAuth, { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            emailVerfied?: boolean;
            role: string;
            image?: string;
        } & DefaultSession['user'];
    }
}