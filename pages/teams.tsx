import {TeamCard} from '@/components/TeamCard';
import {Button, Card, Checkbox,TextInput, Notification, Modal} from '@mantine/core';
import {EventHandler, KeyboardEvent, KeyboardEventHandler, useRef, useState} from 'react';
import {SubmissionForm, Team} from '@/types/types';
import useSWR from 'swr';
import fetcher from '../middleware/fetch';
import Link from "next/link";
import {useRouter} from "next/router";
import {useForm} from "@mantine/form";
import validator from "validator";
import {IncomingMessage, ServerResponse} from "http";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {NextApiRequest, NextApiResponse} from "next";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import prisma from "../prisma/client";

export default function Teams({ url }: { url: string }) {



    const {data, mutate} = useSWR<{
        yourTeam?: string, yourRank?: number, teams: Team[]
    }>('/api/v1/teams', fetcher, {refreshInterval: 3000});

    const [buttonLoading, setButtonLoading] = useState(false);
    const [showJoinable, setShowJoinable] = useState(false);
    const [createTeamError, setCreateTeamError] = useState(false);

    const createNewTeam = async () => {
        setButtonLoading(true);

        const res = await fetch('/api/v1/join', {
            method: 'post', headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({})
        });

        if (res.ok) {
            await mutate();
            setButtonLoading(false);
        } else {
            setCreateTeamError(true);
            setTimeout(() => setCreateTeamError(false), 5_000);
        }
    };

    const router = useRouter()
    const { join } = router.query

    const [joinedFromCode, setjoinedFromCode] = useState(false);

    const joinTeam = async () => {

        const res = await fetch('/api/v1/join', {
            method: 'post', headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json'
            },

            body: JSON.stringify({team: join, fromCode:true})
        });

        if (res.ok) {
            await mutate()
            setjoinedFromCode(false)
        }
    };

    if (data?.teams && data.teams.length != 0) {
        data.teams.sort(t => t.id === data.yourTeam ? -1 : 1)
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center'>
                <h1 className="font-bold text-2xl m-2">View teams</h1>
                <div className="flex flex-wrap flex-col">
                    <Modal
                        opened={joinedFromCode || !!join}
                        onClose={() => {
                            setjoinedFromCode(false)
                            router.push("/teams")
                        }}
                        withCloseButton={false}
                        title="Join this team?"
                    >
                        <div>
                            <Link href="/teams" passHref>
                                <Button color="green" variant='filled' className='' component="a" onClick={joinTeam}>
                                    Accept
                                </Button>
                            </Link>
                            <Link href="/teams" passHref>
                                <Button variant="outline" color="red" className='mx-5' component="a" onClick={() => setjoinedFromCode(false)}>
                                    Reject
                                </Button>
                            </Link>
                        </div>
                    </Modal>
                    <div className='flex flex-wrap flex-row items-end'>
                        <Button className="mx-5" color={!createTeamError ? 'default' : 'red'} disabled={!data?.teams} loading={buttonLoading} onClick={createNewTeam}>
                            Create new team
                        </Button>
                        <Link href="/" passHref>
                            <Button variant='outline' className='mx-5' component="a">
                                Back
                            </Button>
                        </Link>
                    </div>


                    <Checkbox className='m-5' checked={showJoinable} label="Only show teams you can join" onChange={(event) => setShowJoinable(event.currentTarget.checked)} />
                </div>
                <div className="flex flex-wrap">
                    {data?.teams ? (data.teams.length == 0 ? null : data.teams.map(v => {
                        if (v.id === data.yourTeam) {
                            return (<TeamCard key={v.id} userRank={data.yourRank} url={url} {...v} />);
                        }
                        if (showJoinable && (v.locked || v.members.length >= 4)) {
                            return null;
                        }
                        return (<TeamCard key={v.id} url={url} {...v}/>);
                    })) : <div/>}

                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context: { req: (IncomingMessage & { cookies: NextApiRequestCookies; }) | NextApiRequest; res: ServerResponse | NextApiResponse<any>; }) {
    return {
        props: {
            url: process.env.NEXTAUTH_URL
        },
    }
}

Teams.auth = true;