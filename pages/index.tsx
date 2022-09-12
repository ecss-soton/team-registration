import Head from "next/head";
import {useSession} from "next-auth/react";
import {LoginButton} from "@/components/LoginButton";
import {MainTimeline} from "@/components/Timeline"
import {Session, unstable_getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import {User} from "@prisma/client";
import prisma from "../prisma/client";

export default function Home({ session, user }: { session: Session, user: User }) {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>ECSS Hackathon registration</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">

                <h1 className="font-bold text-6xl m-5">ECSS Hackathon registration</h1>

                <MainTimeline user={user}/>

            </main>
        </div>
    );
}

export async function getServerSideProps(context: { req: (IncomingMessage & { cookies: NextApiRequestCookies; }) | NextApiRequest; res: ServerResponse | NextApiResponse<any>; }) {

    const session = await unstable_getServerSession(context.req, context.res, authOptions)

    if (!session?.discord.tag) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            discordTag: session.discord.tag,
        }
    });

    return {
        props: {
            session,
            user
        },
    }
}