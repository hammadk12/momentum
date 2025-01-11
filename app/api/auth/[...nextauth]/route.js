import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import clientPromise from "../../../lib/mongodb"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            const client = await MongoClient.connect(process.env.MONGODB_URI)
            const db = client.db("test") // Adjust the DB name if needed
            const usersCollection = db.collection("users")

            const existingUser = await usersCollection.findOne({ email: user.email })

            // If the user doesn't exist, create a new document with the firstTimeLogin flag
            if (!existingUser) {
                await usersCollection.insertOne({
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    firstTimeLogin: true,
                    createdAt: new Date()
                })
            } else {
                // Optionally update the user to ensure firstTimeLogin is set to false
                await usersCollection.updateOne(
                    { email: user.email },
                    { $set: { firstTimeLogin: false } }
                )
            }
            client.close()
            return true
        },

        // Optional: Attach firstTimeLogin to session for UI logic or further processing
        async session({ session, user }) {
            const client = await MongoClient.connect(process.env.MONGODB_URI)
            const db = client.db("test") // Adjust the DB name if needed
            const usersCollection = db.collection("users")

            const existingUser = await usersCollection.findOne({ email: session.user.email })
            if (existingUser) {
                session.user.id = existingUser._id.toString();
                session.user.firstTimeLogin = existingUser.firstTimeLogin || false
            }
            client.close()
            return session
        }
    }
})

export { handler as GET, handler as POST }