import {Session, unstable_getServerSession} from "next-auth";
import {User} from "@prisma/client";
import Head from "next/head";
import {MainTimeline} from "@/components/Timeline";
import {LoginButton} from "@/components/LoginButton";
import {IncomingMessage, ServerResponse} from "http";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "./api/auth/[...nextauth]";
import prisma from "../prisma/client";
import { Button } from "@mantine/core";
import {signIn, useSession} from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

// @ts-ignore
export default function SignIn({ url }) {

    const router = useRouter();

    const {data: session} = useSession();

    console.log(session)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">

                <h1 className="font-bold text-6xl m-5">ECSS Hackathon registration</h1>

                <LoginButton/>

                {
                    (session && !session.discord?.tag) &&
                    <Link href="/" passHref>
                        <Button className='m-5' component="a">
                            Sign in without discord
                        </Button>
                    </Link>
                }

                {
                    (session && !session.discord?.tag) &&
                    <Link href={`https://sotonverify.link?callback=${url}`} passHref>
                        <Button className='m-5' component="a">
                            Sign in with discord
                        </Button>
                    </Link>
                }

            </main>
        </div>
    );
}

export async function getServerSideProps(context: { req: (IncomingMessage & { cookies: NextApiRequestCookies; }) | NextApiRequest; res: ServerResponse | NextApiResponse<any>; }) {

    const session = await unstable_getServerSession(context.req, context.res, authOptions)

    // if (session && !session?.discord.tag) {
    //     return {
    //         redirect: {
    //             destination: `https://sotonverify.link?callback=${process.env.NEXTAUTH_URL}`,
    //             permanent: false,
    //         },
    //     }
    // }

    if (session && session.discord.tag) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {
            url: process.env.NEXTAUTH_URL
        },
    }
}