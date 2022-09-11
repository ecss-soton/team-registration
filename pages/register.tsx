import {
    MultiSelect,
    NativeSelect,
    Box,
    CloseButton,
    SelectItemProps,
    MultiSelectValueProps,
    TextInput, Checkbox, SelectItem,
    Button
} from '@mantine/core';

import {Tag} from '@/types/types'

import {forwardRef, FunctionComponent, useState} from 'react';
import {
    COriginal,
    CplusplusOriginal, CsharpOriginal,
    JavaOriginal,
    JavascriptOriginal,
    KotlinPlain, PythonOriginal, RubyPlain,
    RustPlain, SqlitePlain,
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
    {label: 'C', value: 'c'}
];

const icons: Record<Tag, FunctionComponent> = {
    "rs": RustPlain,
    "java": JavaOriginal,
    "cpp": CplusplusOriginal,
    "js": JavascriptOriginal,
    "ts": TypescriptOriginal,
    "kt": KotlinPlain,
    "cs": CsharpOriginal,
    "rb": RubyPlain,
    "sql": SqlitePlain,
    "py": PythonOriginal,
    "c": COriginal
};

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

    const yearOfStudy = ['1st year', '2nd year', '3rd year', '4th year', 'postgraduate']

    const valueTooLongMessage = 'Please use less than 2000 characters, Please contact society@ecs.soton.ac.uk if you have any concerns'

    const form = useForm({
        initialValues: {
            yearOfStudy: '',
            knownLanguages: [],
            dietaryReq: '',
            extra: '',
            noPhotos: false,
        },

        validate: {
            yearOfStudy: (value) => (!yearOfStudy.includes(value) ? 'Please enter a valid year of study' : null),
            dietaryReq: (value) => (value.length > 2000 ? valueTooLongMessage : null),
            extra: (value) => (value.length > 2000 ? valueTooLongMessage : null),
        },
    });

    const [formLoading, setFormLoading] = useState(false);

    const submitForm = async (values: { yearOfStudy: string, knownLanguages: string[], dietaryReq: string, extra: string, noPhotos: boolean }) => {
        setFormLoading(true)
        const res = await fetch("/api/v1/register", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                values
            })
        })
        const res2 = await res.json()
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
                        data={yearOfStudy}
                        placeholder="Pick one"
                        label="Which year are you in?"
                        description="This is anonymous"
                        // withAsterisk
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

                    <Checkbox
                        label="I don't want my picture taken at this event"
                        {...form.getInputProps('noPhotos', {type: 'checkbox'})}
                    />

                    <Button loading={formLoading} type="submit">Submit</Button>
                </form>
            </div>
        </>
    );
}

Register.auth = true;