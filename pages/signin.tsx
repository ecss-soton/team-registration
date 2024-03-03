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
import {ActionIcon, Button, Text, useMantineColorScheme} from "@mantine/core";
import {signIn, useSession} from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import {IconMoonStars, IconSun} from "@tabler/icons-react";

// @ts-ignore
export default function SignIn({ url }) {

    const router = useRouter();

    const {data: session} = useSession();

    console.log(session)

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

            <div className='absolute top-2 right-2'>
                <ActionIcon
                    variant="outline"
                    color={dark ? 'yellow' : 'blue'}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                >
                    {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
                </ActionIcon>
            </div>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">

                <div className='flex flex-row justify-center'>
                    {dark ? <img
                        className='max-h-72'
                        src="./AH_white_text.png"
                        alt="Aleios ECSS hackathon logo"
                    /> : <img
                        className='max-h-72'
                        src="./AH_black_text.png"
                        alt="Aleios ECSS hackathon logo"
                    />}

                </div>

                <h1 className="font-bold text-6xl mt-10">ECSS Hackathon registration</h1>

                <Text className='my-5'>
                    Get 24 hours to code a thing around a theme.
                    Login with your university account to register, join a team and see all the details!
                </Text>

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
