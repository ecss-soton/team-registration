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

    if (data && data.teams.length != 0) {
        data.teams.sort(t => t.id === data.yourTeam ? -1 : 1)
    }

    // const valueTooLongMessage = 'Please use less than 16 characters'
    //
    // const form = useForm({
    //     initialValues: {
    //         teamCode: '',
    //     },
    //
    //     validate: {
    //         teamCode: (value) => (value.length > 16 ? valueTooLongMessage : null),
    //     },
    // });
    //
    // const [formLoading, setFormLoading] = useState(false);
    // const [formError, setFormError] = useState(false);
    //
    // const submitForm = async (values: SubmissionForm) => {
    //
    //     if (!values.teamCode) {
    //
    //         const nameErrorMsg = 'You must include a team name';
    //         const githubErrorMsg = 'You must include a link to your repository';
    //         const timeslotErrorMsg = 'You must choose a timeslot';
    //
    //         form.setErrors({
    //             name: !values.name ? nameErrorMsg : null,
    //             githubLink: !values.githubLink ? githubErrorMsg : null,
    //             timeslotErrorMsg: !values.timeslot ? timeslotErrorMsg : null,
    //         });
    //         return;
    //     }
    //
    //     setFormLoading(true)
    //
    //     const res = await fetch("/api/v1/submit", {
    //         method: "post",
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //
    //         //make sure to serialize your JSON body
    //         body: JSON.stringify(values)
    //     })
    //     const res2 = await res.json()
    //     console.log(res2)
    //     if (res2.success) {
    //         setFormLoading(false);
    //         setFormError(false);
    //     } else {
    //         setFormLoading(false);
    //         setFormError(true);
    //     }
    // }

    const ref = useRef<HTMLInputElement>(null);

    // ref.current.
    const handleInputCode = (e: KeyboardEvent) => {
        console.log(e)
        if (e.key === 'Enter') {
            console.log('YES')
        }
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
                        {/*<form className='w-full sm:w-2/4 max-w-2xl mt-10 space-y-7' onSubmit={form.onSubmit(submitForm)}>*/}
                            <TextInput
                                ref={ref}
                                placeholder="3vtVSqA7"
                                className="mx-5"
                                label="Join a team with a code"
                                onKeyPress={handleInputCode}
                            />
                        {/*</form>*/}
                        <Button  className="mx-5" loading={buttonLoading} onClick={createNewTeam}>
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
                <div className="flex flex-wrap max-w-xl">
                    {data ? (data.teams.length == 0 ? null : data.teams.map(v => {
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