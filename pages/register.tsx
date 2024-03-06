import {
    MultiSelect,
    NativeSelect,
    Box,
    CloseButton,
    SelectItemProps,
    MultiSelectValueProps,
    TextInput, Checkbox, SelectItem,
    Button, Text
} from '@mantine/core';

import {RegisterForm, Tag} from '@/types/types'

import {forwardRef, FunctionComponent, useState} from 'react';
import {
    COriginal,
    CplusplusOriginal, CsharpOriginal, FlutterOriginal, GoOriginal, HaskellOriginal,
    JavaOriginal,
    JavascriptOriginal,
    KotlinPlain, PythonOriginal, RubyPlain,
    RPlain, SqlitePlain, SwiftPlain,
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


const langData: (SelectItem & { value: Tag })[] = [
    {label: 'Rust', value: 'rs'},
    {label: 'Java', value: 'java'},
    {label: 'C++', value: 'cpp'},
    {label: 'Javascript', value: 'js'},
    {label: 'Typescript', value: 'ts'},
    {label: 'Kotlin', value: 'kt'},
    {label: 'C#', value: 'cs'},
    {label: 'Ruby', value: 'rb'},
    {label: 'SQL', value: 'sql'},
    {label: 'Python', value: 'py'},
    {label: 'C', value: 'c'},
    {label: 'Flutter', value: 'dart'},
    {label: 'Swift', value: 'swift'},
    {label: 'Go', value: 'go'},
    {label: 'Haskell', value: 'hs'}
];

export const icons: Record<Tag, FunctionComponent> = {
    "rs": RPlain,
    "java": JavaOriginal,
    "cpp": CplusplusOriginal,
    "js": JavascriptOriginal,
    "ts": TypescriptOriginal,
    "kt": KotlinPlain,
    "cs": CsharpOriginal,
    "rb": RubyPlain,
    "sql": SqlitePlain,
    "py": PythonOriginal,
    "c": COriginal,
    "go": GoOriginal,
    "dart": FlutterOriginal,
    "swift": SwiftPlain,
    "hs": HaskellOriginal
};

const yearOfStudy: Record<string, RegisterForm['yearOfStudy']> = {
    '1st year': 1,
    '2nd year': 2,
    '3rd year': 3,
    '4th year': 4,
    'postgraduate': 5,
}

function Value({
                   value,
                   label,
                   onRemove,
                   classNames,
                   ...others
               }: MultiSelectValueProps & { value: Tag }) {
    const Icon = icons[value];
    return (
        <div {...others}>
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    cursor: 'default',
                    alignItems: 'center',
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]}`,
                    paddingLeft: 10,
                    borderRadius: 4,
                })}
            >
                <Box mr={10}>
                    <Icon/>
                </Box>
                <Box sx={{lineHeight: 1, fontSize: 12}}>{label}</Box>
                <CloseButton
                    onMouseDown={onRemove}
                    variant="transparent"
                    size={22}
                    iconSize={14}
                    tabIndex={-1}
                />
            </Box>
        </div>
    );
}

// eslint-disable-next-line react/display-name
const Item = forwardRef<HTMLDivElement, SelectItemProps>(({label, value, ...others}, ref) => {
    // Cannot be undefined
    const Flag = icons[value as Tag];
    return (
        <div ref={ref} {...others}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box mr={10}>
                    <Flag/>
                </Box>
                <div>{label}</div>
            </Box>
        </div>
    );
});

interface RegisterProps {
    session: Session
}


export default function Register({session}: RegisterProps) {

    const router = useRouter();

    const valueTooLongMessage = 'Please use less than 2000 characters, Please contact society@ecs.soton.ac.uk if you have any concerns'

    const form = useForm({
        initialValues: {
            yearOfStudy: '',
            knownLanguages: [],
            dietaryReq: '',
            extra: '',
            agreePhotos: false,
        },

        validate: {
            yearOfStudy: (value) => (!Object.keys(yearOfStudy).includes(value) ? 'Please enter a valid year of study' : null),
            dietaryReq: (value) => (value.length > 2000 ? valueTooLongMessage : null),
            extra: (value) => (value.length > 2000 ? valueTooLongMessage : null),
        },
    });

    const [formLoading, setFormLoading] = useState(false);

    const submitForm = async (values: { yearOfStudy: string, knownLanguages: Tag[], dietaryReq: string, extra: string, agreePhotos: boolean }) => {

        if (!values.agreePhotos) {
            form.setErrors({
                agreePhotos: 'You must agree to proceed'
            });
            return;
        }

        setFormLoading(true)

        const submissionValues: RegisterForm = {
            yearOfStudy: yearOfStudy[values.yearOfStudy],
            knownLanguages: values.knownLanguages,
            dietaryReq: values.dietaryReq,
            extra: values.extra,
            photoConsent: values.agreePhotos,
        }

        const res = await fetch("/api/v1/register", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(submissionValues)
        })
        const res2 = await res.json()
        console.log("register res2", res2)
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
                    <NativeSelect
                        data={Object.keys(yearOfStudy)}
                        // placeholder="Pick one"
                        label="Which year are you in?"
                        {...form.getInputProps('yearOfStudy')}
                    />

                    <MultiSelect
                        data={langData}
                        valueComponent={Value}
                        itemComponent={Item}
                        searchable
                        nothingFound="Nothing found"
                        label="What programming languages do you know?"
                        {...form.getInputProps('knownLanguages')}
                    />

                    <TextInput
                        label="Do you have any dietary requirements?"
                        {...form.getInputProps('dietaryReq')}
                    />

                    <TextInput
                        label="Anything else we should know?"
                        {...form.getInputProps('extra')}
                    />

                    <div>
                        <p className='text-sm mb-3'>
                            We plan to have photography at and throughout this event. If you dont wish to have your photo taken,
                            please find a committee member (preferably one of the ones taking pictures) and let them know
                        </p>

                        <Checkbox
                            label="Tick this box to say you understand / agree to this"
                            {...form.getInputProps('agreePhotos', {type: 'checkbox'})}
                        />

                        {form.errors.agreePhotos && <Text size={15} className='text-xs' color='red'>{form.errors.agreePhotos}</Text>}
                    </div>

                    <div className='space-x-1.5'>
                        <Button loading={formLoading} type="submit">Submit</Button>
                        <Button variant="outline" component="a" href={"/hackathon/"}>Back</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Register.auth = true;
