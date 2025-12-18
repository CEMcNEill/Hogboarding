import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    debug: true,
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Resend({
            // If no API key is provided, NextAuth defaults to printing the token to console in Dev
            from: "onboarding@resend.dev",
            sendVerificationRequest: async ({ identifier: email, url }) => {
                console.log("----------------------------------------------")
                console.log(`LOGIN LINK FOR ${email}:`)
                console.log(url)
                console.log("----------------------------------------------")
            }
        })
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session
        }
    }
})
