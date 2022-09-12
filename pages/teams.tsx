import {useSession} from "next-auth/react";
import {IncomingMessage, ServerResponse} from "http";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {NextApiRequest, NextApiResponse} from "next";
import {Session, unstable_getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import prisma from "../prisma/client";
import { BadgeCardProps, TeamCard } from '@/components/TeamCard';
import { ActionIcon, Button, Card, Container, Group, Space, Text, Tooltip } from '@mantine/core';
import { IconLock, IconLockOpen } from '@tabler/icons';

const test: BadgeCardProps = {
    teamName: "Delta force", // Don't know if we need team names, but they definitely should not be user defined.
    members: [{name: "Yum Adaf (txh6g20)", tags: ["rs", "cpp"], discordTag: "fasdfdas#5138"}],
    locked: false,
    userIsAdmin: false
}

export default function Teams({ session }: { session: Session }) {

    const teams = ['','','','','','','','',];

    return (
        <>
            <div className='flex flex-wrap'>
                {
                    teams.map(v => {
                        return (
                            <TeamCard key={v} {...test}/>
                        )
                    })
                }
                <Card className="m-5" withBorder radius="md" p="md">
                    <Button radius="md">
                        Create new team
                    </Button>
                    <Button radius="md">
                        Create new locked team
                    </Button>
                </Card>
            </div>
        </>
    )
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

    return {
        props: {
            session,
        },
    }
}

Teams.auth = true