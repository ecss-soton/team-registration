import {useSession} from "next-auth/react";
import {IncomingMessage, ServerResponse} from "http";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {NextApiRequest, NextApiResponse} from "next";
import {Session, unstable_getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import prisma from "../prisma/client";
import {TeamCard} from "@/components/TeamCard";

const test = {
    teamName: "Delta force",
    members: []
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