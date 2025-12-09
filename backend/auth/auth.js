import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { Pool } from "pg"
import dotenv from "dotenv";
dotenv.config();


const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },

  trustedOrigins: [
    "http://localhost:5173",
    "https://composter.vercel.app",
    process.env.CLIENT_URL
  ].filter(Boolean),

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  advanced: {
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: true,
    },
  },

  cookies: {
    session_token: {
      name: "__Secure-better-auth.session_token",
      options: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      }
    },
    session_data: {
      name: "__Secure-better-auth.session_data", 
      options: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      }
    }
  },

  plugins: [
    jwt()
  ],
})

export default auth;
