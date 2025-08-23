import {getServerSession} from "next-auth";
import NextImage from "next/image";
import {LoginButton} from "@/components/LoginButton";
import {IncomingMessage, ServerResponse} from "http";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "./api/auth/[...nextauth]";
import {ActionIcon, Button, Text, useMantineColorScheme} from "@mantine/core";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import darkIcon from '../public/hackstart-hex.svg';
import lightIcon from '../public/hackstart-hex.svg'
// @ts-ignore
export default function SignIn({ url }) {

    const router = useRouter();

    const {data: session} = useSession();

    console.log("session", session)

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

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

            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">

                <div className='flex flex-row justify-center'>
                    {dark ? <NextImage
                        className='max-h-72'
                        src={darkIcon}
                        alt="Prde ECSS hackathon logo"
                        style={{ objectFit: 'contain' }}
                    /> : <NextImage
                        className='max-h-72'
                        src={lightIcon}
                        alt="Pride ECSS hackathon logo"
                        style={{ objectFit: 'contain' }}
                    />}

                </div>

                <h1 className="font-bold text-6xl mt-10">ECSS SotonHack registration</h1>

                <Text className='my-5'>
                    Login with your university account to register, join a team and see all the details!
                </Text>

                <LoginButton/>

                {
                    (session && !session.discord?.tag) &&
                        <Button className='m-5' component="a" href={"/hackathon"}>
                            Sign in without discord
                        </Button>
                }

                {
                    (session && !session.discord?.tag) &&
                    <Button className='m-5' component="a" href={`https://sotonverify.link?callback=${url}`}>
                        Sign in with discord
                    </Button>
                }

            </main>
        </div>
    );
}

export async function getServerSideProps(context: { req: (IncomingMessage & { cookies: NextApiRequestCookies; }) | NextApiRequest; res: ServerResponse | NextApiResponse<any>; }) {

    const session = await getServerSession(context.req, context.res, authOptions)

    // if (session && !session?.discord.tag) {
    //     return {
    //         redirect: {
    //             destination: `https://sotonverify.link?callback=${process.env.NEXTAUTH_URL}`,
    //             permanent: false,
    //         },
    //     }
    // }

    if (session && session.discord.tag) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {
            url: process.env.BASE_URL
        },
    }
}
