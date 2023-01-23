import {
    MultiSelect,
    NativeSelect,
    Box,
    CloseButton,
    SelectItemProps,
    MultiSelectValueProps,
    TextInput, Checkbox, SelectItem,
    Button,
    Text,
    Select
} from '@mantine/core';

import {RegisterForm, SubmissionForm, Tag} from '@/types/types'

import {forwardRef, FunctionComponent, useState} from 'react';
import {
    COriginal,
    CplusplusOriginal, CsharpOriginal, FlutterOriginal, GoOriginal,
    JavaOriginal,
    JavascriptOriginal,
    KotlinPlain, PythonOriginal, RubyPlain,
    RustPlain, SqlitePlain, SwiftPlain,
    TypescriptOriginal
} from 'devicons-react';
import {IncomingMessage, ServerResponse} from "http";
import {Session, unstable_getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../prisma/client";
import {useForm} from "@mantine/form";
import {useRouter} from "next/router";
import Link from "next/link";
import validator from 'validator';





interface SubmitProps {
    session: Session
    submission: {
        name: string,
        githubLink: string,
        submissionTime: string,
        timeslot: string
    },
    takenSlots: string[]
}


export default function Submit({ session, submission, takenSlots }: SubmitProps) {

    const router = useRouter();

    const valueTooLongMessage = 'Please use less than 200 characters'

    const allTimeSlots = [
        '12:10-12:17',
        '12:17-12:24',
        '12:24-12:31',
        '12:31-12:38',
        '12:38-12:45',
        '12:52-12:59',
        '12:59-13:06',
        '13:06-13:13',

        '13:30-13:37',
        '13:37-13:44',
        '13:44-13:51',
        '13:51-13:58',
        '13:58-14:05',
        '14:05-14:12',
        '14:12-14:19',
        '14:19-14:26',

        'any'
    ].filter(i => !takenSlots.includes(i))

    const form = useForm({
        initialValues: {
            name: '',
            githubLink: '',
            timeslot: '',
        },

        validate: {
            name: (value) => (value.length > 200 ? valueTooLongMessage : null),
            githubLink: (value) => {
                if (value.length > 200) return valueTooLongMessage
                if (!validator.isURL(value)) return 'Please enter a valid url'
                return null
            },
            timeslot: (value) => {
                console.log(value)
                if (value === '') return 'You must choose a timeslot'
                return null
            }
        },
    });

    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(false);

    const submitForm = async (values: SubmissionForm) => {
        console.log(values)
        if (!values.name || !values.githubLink || !values.timeslot) {

            const nameErrorMsg = 'You must include a team name';
            const githubErrorMsg = 'You must include a link to your repository';
            const timeslotErrorMsg = 'You must choose a timeslot';

            form.setErrors({
                name: !values.name ? nameErrorMsg : null,
                githubLink: !values.githubLink ? githubErrorMsg : null,
                timeslotErrorMsg: !values.timeslot ? timeslotErrorMsg : null,
            });
            return;
        }

        setFormLoading(true)

        const res = await fetch("/api/v1/submit", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(values)
        })
        const res2 = await res.json()
        console.log(res2)
        if (res2.success) {
            setFormLoading(false);
            setFormError(false);
            await router.push("/");
        } else {
            setFormLoading(false);
            setFormError(true);
        }
    }

    return (
        <>
            <div className='flex justify-center p-3'>


                <form className='w-full sm:w-2/4 max-w-2xl mt-10 space-y-7' onSubmit={form.onSubmit(submitForm)}>
                    <div>
                        <h3 className='text-4xl'>Project submission</h3>
                        <Text size="sm" className='mt-3'>Only one person from your team needs to submit</Text>
                    </div>
                    {
                        submission?.submissionTime &&
                        <Text color="green">You have already submitted if you submit again your previous submission will be overwritten</Text>
                    }
                    <TextInput
                        label="Team name"
                        placeholder="The best team"
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        label="GitHub repository link"
                        placeholder="https://github.com/ecss-soton/team-registration"
                        description="Please make sure your GitHub repository is public"
                        {...form.getInputProps('githubLink')}
                    />

                    <Select
                        label="What timeslot would you like to present your idea in"
                        placeholder="Pick one"
                        data={allTimeSlots}
                        {...form.getInputProps('timeslot')}
                    />

                    <div className='space-x-1.5'>
                        {
                            formError &&
                            <Text size="sm" className='m-3' color="red"><i>Make sure you are in a team before submission or try a different timeslot</i></Text>
                        }
                        <Button loading={formLoading} type="submit">Submit</Button>
                        <Link href="/" passHref >
                            <Button variant="outline" component="a">Back</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
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

    const user = await prisma.user.findUnique({
        where: {
            sotonId: session.microsoft.email.split('@')[0],
        },
        include: {
            team: {}
        }
    });

    const teams = await prisma.team.findMany()

    return {
        props: {
            submission: {
                name: user?.team?.name || null,
                githubLink: user?.team?.githubLink || null,
                submissionTime: user?.team?.submissionTime?.toISOString() || null,
            },
            takenSlots: teams.map(t => t.timeslot)
        },
    }
}

Submit.auth = true;