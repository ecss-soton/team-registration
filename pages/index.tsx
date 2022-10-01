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
import { Button, Text, Image } from "@mantine/core";
import Link from "next/link";
import axios from "axios";

export default function Home({ session, user }: { session: Session, user: User }) {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>ECSS Hackathon registration</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-2 text-center">

                <div className='flex flex-row justify-center'>
                    <img
                        className='max-h-72'
                        src="./picohack.png"
                        alt="Random unsplash image"
                    />
                    {/*<h1 className="font-bold text-6xl m-5">ECSS PicoHack dashboard</h1>*/}
                </div>


                <div>



                    <Text>
                        Welcome to the first ECSS hackathon of this academic year! Meet us in <Text variant="link" component="a" href="https://data.southampton.ac.uk/building/16.html">Building 16</Text> on Saturday 1st before 10am.
                    </Text>

                    <Link href="https://discord.gg/hVE47ygszV" passHref>
                        <Button target='_blank' component="a" className='m-5'>
                            Join discord
                        </Button>
                    </Link>

                    <Link href="/teams" passHref>
                        <Button className='mt-3' component="a">View teams</Button>
                    </Link>

                </div>



                <div className='m-10'>
                    <MainTimeline user={user}/>
                </div>


            </main>
        </div>
    );
}

export async function getServerSideProps(context: { req: (IncomingMessage & { cookies: NextApiRequestCookies; }) | NextApiRequest; res: ServerResponse | NextApiResponse<any>; }) {

    const session = await unstable_getServerSession(context.req, context.res, authOptions)

    if (!session?.microsoft.email) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        }
    }

    if (!session?.discord.tag) {

        try {
            const sotonVerifyData = await axios({
                method: 'GET',
                url: `https://sotonverify.link/api/v2/user?sotonId=${session.microsoft.email.split('@')[0]}`,
                headers: {
                    Authorization: String(process.env.SOTON_VERIFY_API_AUTH)
                },
                data: {
                    guildId: '1008673689665032233',
                }
            })

            await prisma.user.update({
                data: {
                    discordTag: sotonVerifyData.data.discordTag,
                    discordId: sotonVerifyData.data.discordId,
                },
                where: {
                    sotonId: session.microsoft.email.split('@')[0],
                }
            })

        } catch {
            console.log('get fucked')
        }


    }

    const user = await prisma.user.findUnique({
        where: {
            sotonId: session.microsoft.email.split('@')[0],
        }
    });

    return {
        props: {
            session,
            user: JSON.parse(JSON.stringify(user))
        },
    }
}