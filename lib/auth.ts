import User from "@/models/User";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import { connectTodb } from "./db";
export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Provide the email and password");
                }
                try {
                    await connectTodb();
                    const user = await User.findOne({ email: credentials.email })
                    if (!user) {
                        throw new Error("User is not present.");
                    }
                    const valid = await bcrypt.compare(
                        credentials.password,
                        user.password,
                    )
                    console.log(valid);
                    
                    if (!valid) {
                        throw new Error("Invalid Password.")
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    throw error;
                }

            }
        }),
    ],
    callbacks: {
        jwt({ user, token, account }) {
            if (user) {
                token.id = user.id
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    }

}