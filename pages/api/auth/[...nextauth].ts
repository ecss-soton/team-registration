import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad";
import DiscordProvider from "next-auth/providers/discord";
// import {PrismaAdapter} from "../../../prisma/adapter";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../prisma/client";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/',
    signOut: '/',
  },
  providers: [
    AzureADProvider({
      clientId: String(process.env.AZURE_AD_CLIENT_ID),
      clientSecret: String(process.env.AZURE_AD_CLIENT_SECRET),
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile User.Read email",
        },
      },
      async profile(profile, tokens) {


        const microsoftData = await fetch(
            `https://graph.microsoft.com/v1.0/me/`,
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            }
        )

        const sotonData = await microsoftData.json();
        tokens.ext_expires_in = undefined;


        const sotonVerifyData = await fetch(
            `https://reliable-sprinkles-18ff83.netlify.app/api/v1/user/${sotonData.mail.split('@')[0]}`,
            {
              headers: {
              }
            }
        )

        const discordData = await sotonVerifyData.json();

        return {
          id: sotonData.mail.split('@')[0],
          firstName: sotonData.surname,
          lastName: sotonData.givenName,
          displayName: sotonData.displayName,
          sotonId: sotonData.mail.split('@')[0],
          school: sotonData.jobTitle,

          discordId: discordData.discordId,
          discordTag: discordData.discordTag,
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.firstName = user.firstName;
      session.lastName = user.lastName;
      session.discord = {
        tag: user.discordTag,
      };
      session.microsoft = {
        email: user.sotonId + '@soton.ac.uk',
      };
      return session
    }
  }
})