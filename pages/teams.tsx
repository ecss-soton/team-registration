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
import {useState} from "react";
import {RegisterForm, Team} from "@/types/types";

export default function Teams({ teams, session }: { teams: Team[], session: Session }) {

    const [buttonLoading, setButtonLoading] = useState(false);

    const createNewTeam = async () => {
        setButtonLoading(true);

        const res = await fetch("/api/v1/join", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({})
        })

        const res2 = await res.json()
        console.log(res2)
        if (res2) {
            setButtonLoading(false);
            teams.push(res2)
        }
    }

    return (
        <>
            <div className='flex flex-wrap'>
                {
                    teams.length == 0 ? null : teams.map(v => {
                        return (
                            <TeamCard key={v.id} {...v}/>
                        )
                    })
                }
                <Card className="m-5" withBorder radius="md" p="md">
                    <Button loading={buttonLoading} onClick={createNewTeam}>
                        Create new team
                    </Button>
                </Card>
            </div>
        </>
    )
}

export async function getServerSideProps(context: { req: (IncomingMessage & { cookies: NextApiRequestCookies; }) | NextApiRequest; res: ServerResponse | NextApiResponse<any>; }) {

    const session = await unstable_getServerSession(context.req, context.res, authOptions)

    const teams = await prisma.team.findMany({
        include: {
            members: true
        }
    });

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
            teams: JSON.parse(JSON.stringify(teams))
        },
    }
}

Teams.auth = true