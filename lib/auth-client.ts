import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import EspooUserModel from "@/app/models/usermodel";
import { connectDB } from "./mongoose";
import { EspooUser } from "@/app/types";

async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername.toLowerCase().replace(/\s+/g, "_");
  let count = 0;
  while (await EspooUserModel.findOne({ username })) {
    count++;
    username = `${baseUsername.toLowerCase().replace(/\s+/g, "_")}_${count}`;
  }
  return username;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();
        const provider = account?.provider;
        const providerId = account?.providerAccountId;
        let existingUser;

        if (provider === "google" || provider === "linkedin") {
          const email = user.email || `${provider}_${Date.now()}@placeholder.com`;

          if (provider === "google") {
            existingUser = await EspooUserModel.findOne({ email });
          } else {
            existingUser = await EspooUserModel.findOne({ oauthId: providerId });
          }

          if (!existingUser) {
            const usernameBase = user.name || `${provider}_user_${providerId}`;
            const uniqueUsername = await generateUniqueUsername(usernameBase);
            existingUser = await EspooUserModel.create({
              email,
              username: uniqueUsername,
              name: user.name,
              avatar: user.image,
              oauthProvider: provider,
              oauthId: providerId,
              emailVerified: provider === "google",
            });
          }

          user.id = existingUser._id.toString();
          user.username = existingUser.username;
          user.email = existingUser.email;
          user.oauthProvider = existingUser.oauthProvider;
        }

        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        const u = user as EspooUser;
        return {
          ...token,
          id: u.id,
          username: u.username,
          email: u.email,
          oauthProvider: u.oauthProvider,
        };
      }
      return token;
    },

    async session({ session, token }) {
        if (!token || !session.user) return session;
      
        try {
          await connectDB();
      
          const user = await EspooUserModel.findById(token.id);
      
          if (user) {
            // Map safely to session.user
            session.user.id = user._id.toString();
            session.user.username = user.username ?? "";
            session.user.email = user.email ?? "";
            session.user.name = user.name ?? "";
            session.user.oauthProvider = user.oauthProvider ?? "";
            session.user.business = user.business ?? [];
            session.user.appointments = user.appointments ?? [];
          }
      
          session.accessToken = token.accessToken as string | undefined;
          return session;
        } catch (err) {
          console.error("[Session] Error fetching user:", err);
          return session;
        }
      },      

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/home`;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
