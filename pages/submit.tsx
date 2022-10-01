import {
    MultiSelect,
    NativeSelect,
    Box,
    CloseButton,
    SelectItemProps,
    MultiSelectValueProps,
    TextInput, Checkbox, SelectItem,
    Button,
    Text
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






interface SubmitProps {
    session: Session
}


export default function Submit({session}: SubmitProps) {

    const router = useRouter();

    const valueTooLongMessage = 'Please use less than 200 characters'

    const form = useForm({
        initialValues: {
            name: '',
            githubLink: '',
        },

        validate: {
            name: (value) => (value.length > 200 ? valueTooLongMessage : null),
            githubLink: (value) => (value.length > 200 ? valueTooLongMessage : null),
        },
    });

    const [formLoading, setFormLoading] = useState(false);

    const submitForm = async (values: SubmissionForm) => {

        if (!values.name || !values.githubLink) {

            const nameErrorMsg = 'You must include a team name';
            const githubErrorMsg = 'You must include a link to your repository';

            form.setErrors({ name: !values.name ? nameErrorMsg : null, githubLink: !values.githubLink ? githubErrorMsg : null });
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
            await router.push("/");
        }
    }

    return (
        <>
            <div className='flex justify-center p-3'>


                <form className='w-full sm:w-2/4 max-w-2xl mt-40 space-y-7'
                      onSubmit={form.onSubmit(submitForm)}>
                    <Text color="red">Only one person from your team needs to submit</Text>
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


                    <div className='space-x-1.5'>
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

Submit.auth = true;