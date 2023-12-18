import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'Credentials',
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password,
                    }),
                })
                const user = await res.json()
                console.log(user)

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    /*session: {
        strategy: "jwt", // default
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        encryption: true,
        maxAge: 24 * 60 * 60, // 1day
    },*/
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user }
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken
            return session
        },
        jwt1({ token, trigger, session }) {
            if (trigger === "update" && session?.user) {
                // Note, that `session` can be any arbitrary object, remember to validate it!
                token.user = session.user
            }
            return { ...token, ...user }
        },
        // Using the `...rest` parameter to be able to narrow down the type based on `trigger`
        session1({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.accessToken = token.accessToken
            session.user.id = token.id

            return session
        }
    }
})

export { handler as GET, handler as POST }
