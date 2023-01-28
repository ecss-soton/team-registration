import Head from "next/head";
import {useSession} from "next-auth/react";
import {LoginButton} from "@/components/LoginButton";
import {MainTimeline} from "@/components/Timeline"
import {Session, unstable_getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import {User,Team} from "@prisma/client";
import prisma from "../prisma/client";
import {Button, Text, Image, Tabs, useMantineColorScheme, ActionIcon} from "@mantine/core";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import {IconUsers, IconTimeline, IconSun, IconMoonStars} from "@tabler/icons";
import {TeamCard} from "@/components/TeamCard";

export default function Home({ session, user, url, team }: { session: Session, user: User, url: string, team: Team }) {

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <div>
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


            <main className="flex flex-col items-center justify-center w-full flex-1 px-2 text-center">

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


                <div>
                    <Text>
                        Welcome to the second ECSS hackathon of this academic year!
                        Meet us in <Text variant="link" component="a" href="https://data.southampton.ac.uk/building/16.html">Building 16</Text> on Saturday 11th February at 10am.
                    </Text>

                    <div className='flex flex-row flex-wrap justify-center'>
                        <Link href="https://discord.gg/WZQzcsFKZq" passHref>
                            <Button
                                styles={{ root: { backgroundColor: '#5865F2', '&:hover': { backgroundColor: '#3c48d2' } } }}
                                leftIcon={<FontAwesomeIcon icon={faDiscord} className='text-white text-lg h-4 w-5'/>}
                                target='_blank'
                                component="a"
                                className='m-3'>
                                Join discord
                            </Button>
                        </Link>

                        <Link href="/teams" passHref>
                            <Button className='m-3' component="a">View teams</Button>
                        </Link>

                        {new Date() > new Date("12 february 2023 11:00:00") && <Link href="/submit" passHref>
                            <Button variant="outline" className='m-3' component="a">Submit your project</Button>
                        </Link>}
                    </div>


                </div>


                <Tabs defaultValue="timeline" className='w-full'>
                    <Tabs.List position="center">
                        <Tabs.Tab value="timeline" icon={<IconTimeline size={14} />}>Timeline</Tabs.Tab>
                        <Tabs.Tab value="team" icon={<IconUsers size={14} />}>Your Team</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="timeline" pt="xs">
                        <div className='m-10 flex justify-center'>
                            <MainTimeline user={user}/>
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="team" pt="xs">
                        {!team && <p>You do not have a team yet</p>}
                        {(team && !team.timeslot) && <p>Book a slot</p>}
                        {(team && team.timeslot) && <p>Your slot is at {team.timeslot}</p>}
                    </Tabs.Panel>
                </Tabs>





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
        },
        include: {
            team: true
        }
    });



    return {
        props: {
            session,
            user: JSON.parse(JSON.stringify(user)),
            url: process.env.NEXTAUTH_URL,
            team: JSON.parse(JSON.stringify(user?.team)) || false,
        },
    }
}