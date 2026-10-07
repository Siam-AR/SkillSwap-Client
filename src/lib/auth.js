import { betterAuth } from "better-auth";
import { customSession, jwt } from "better-auth/plugins";
import { cookies } from "next/headers";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, clientPromise } from "./server-db";

const authDbName = process.env.AUTH_DB_NAME || "taskify";

const db = client.db(authDbName);

const appUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

const trustedOrigins = [
  appUrl,
  "http://localhost:3000",
  "http://localhost:5000",
].filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "Client",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const cookieStore = await cookies();
          const pendingRole = cookieStore.get("taskify_oauth_role")?.value;

          return {
            data: {
              ...user,
              role: pendingRole === "Freelancer" ? "Freelancer" : (user.role || "Client"),
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "jwt",
    },
    cookie: {
      name: "taskify_session",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    },
  },
  trustedOrigins,
  plugins: [
    jwt(),
    customSession(async ({ user, session }) => ({
      user: {
        ...user,
        role: user.role ?? "Client",
      },
      session,
    })),
  ],
  baseURL: appUrl,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },
});

