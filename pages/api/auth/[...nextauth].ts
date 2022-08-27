import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad";
import DiscordProvider from "next-auth/providers/discord";
// import {PrismaAdapter} from "../../../prisma/adapter";
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import prisma from "../../../prisma/client";
import axios from "axios";
import {NextApiRequest, NextApiResponse} from "next";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, {
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

                    tokens.ext_expires_in = undefined;

                    const sotonVerifyData = await axios({
                        method: 'GET',
                        url: `https://reliable-sprinkles-18ff83.netlify.app/api/v2/user?sotonId=${profile.email.split('@')[0]}`,
                        headers: {
                            Authorization: String(process.env.SOTON_VERIFY_API_AUTH)
                        },
                        data: {
                            guildId: '1008673689665032233',
                        }
                    })

                    const data = sotonVerifyData.data;

                    if (data.error) {
                        res.redirect('https://society.ecs.soton.ac.uk/verify');
                    }

                    return {
                        id: data.sotonId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        displayName: `${data.firstName} ${data.lastName} (${data.sotonId})`,
                        sotonId: data.sotonId,
                        discordId: data.discordId,
                        discordTag: data.discordTag,
                    }
                }
            }),
        ],
        callbacks: {
            async session({session, token, user}) {
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
}