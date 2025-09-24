import {MainTimeline} from "@/components/Timeline"
import {getServerSession, Session} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import {IncomingMessage, ServerResponse} from "http";
import {NextApiRequest, NextApiResponse} from "next";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {Tag, Team, User} from "@prisma/client";
import prisma from "../prisma/client";
import NextImage from "next/image";
import {ActionIcon, Badge, Box, Button, Checkbox, CloseButton, MultiSelect, MultiSelectValueProps, NativeSelect, SelectItem, SelectItemProps, Tabs, Text, TextInput, useMantineColorScheme} from "@mantine/core";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import {IconCertificate, IconMoonStars, IconSun, IconTimeline, IconUserCircle, IconUsers} from "@tabler/icons-react";
import {CvUpload} from "@/components/CvUpload";
import {useRouter} from "next/router";
import darkIcon from '../public/hackstart-hex.svg';
import lightIcon from '../public/hackstart-hex.svg'
import {Profile} from "@/components/Profile";
import { FormEvent, forwardRef, FunctionComponent, useState } from "react";
import { RegisterForm } from "@/types/types";
import { useForm } from "@mantine/form";
import { RustOriginal, JavaOriginal, CplusplusOriginal, JavascriptOriginal, TypescriptOriginal, KotlinPlain, CsharpOriginal, RubyPlain, SqlitePlain, PythonOriginal, COriginal, GoOriginal, FlutterOriginal, SwiftPlain, HaskellOriginal } from "devicons-react";
import { Value as PrismaValue } from "@prisma/client/runtime/library";

// export default function Home({ session, user, team }: { session: Session, user: User, team: Team }) {

//     const router = useRouter()
//     let { tab } = router.query

//     if (Array.isArray(tab)) tab = tab[0]

//     const tabs = ['profile', 'timeline', 'team', 'cv']
//     if (tab && !tabs.includes(tab)) tab = undefined

//     const { colorScheme, toggleColorScheme } = useMantineColorScheme();
//     const dark = colorScheme === 'dark';

//     return (
//         <div>
//             <div className='absolute top-2 right-2'>
//                 <ActionIcon
//                     variant="outline"
//                     color={dark ? 'yellow' : 'blue'}
//                     onClick={() => toggleColorScheme()}
//                     title="Toggle color scheme"
//                 >
//                     {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
//                 </ActionIcon>
//             </div>


//             <main className="flex flex-col items-center justify-center w-screen flex-1 px-2 text-center">

//                 <div className='flex flex-row justify-center'>
//                     {dark ? <NextImage
//                         className='max-h-72'
//                         src={darkIcon}
//                         alt="Fusion ECSS hackathon logo"
//                         style={{ objectFit: 'contain' }}
//                     /> : <NextImage
//                         className='max-h-72'
//                         src={lightIcon}
//                         alt="Fusion ECSS hackathon logo"
//                         style={{ objectFit: 'contain' }}
//                     />}

//                 </div>


//                 <div>
//                     <Text>
//                         Welcome to HackStart!
//                         Meet us in <Text variant="link" component="a" href="https://data.southampton.ac.uk/building/60.html">Building 60</Text> on Saturday 27th September at 10:00am.
//                     </Text>

//                     <div className='flex flex-row flex-wrap justify-center'>
//                         <Button
//                             styles={{ root: { backgroundColor: '#5865F2', '&:hover': { backgroundColor: '#3c48d2' } } }}
//                             leftIcon={<FontAwesomeIcon icon={faDiscord} className='text-white text-lg h-4 w-5'/>}
//                             target='_blank'
//                             href={'https://discord.gg/pnKCFpy4'}
//                             component="a"
//                             className='m-3'>
//                             Join discord
//                         </Button>

//                         {/* <Button className='m-3' component="a" href={"/hackathon/register"}>Update Profile Info</Button> */}

//                         <Button className='m-3' component="a" href={"/hackathon/teams"}>View teams</Button>

//                         {/* <Button className='m-3' component="a" href={"/hackathon/qr"}>Sign in QR code</Button> */}

//                         {new Date() > new Date("16 march 2024 11:00:00") &&
//                             <Button variant="outline" className='m-3' component="a" href={"/hackathon/submit"}>Submit your project</Button>
//                         }
//                     </div>


//                 </div>


//                 <Tabs defaultValue={tab || "timeline"} className='w-screen'>
//                     <Tabs.List position="center">
//                         <Tabs.Tab value="timeline" icon={<IconTimeline size={14} />}>Timeline</Tabs.Tab>
//                         <Tabs.Tab value="team" icon={<IconUsers size={14} />}>Your Team</Tabs.Tab>
//                         <Tabs.Tab value="profile" icon={<IconUserCircle size={14} />}>Profile</Tabs.Tab>
//                         {/* <Tabs.Tab
//                             value="cv"
//                             icon={<IconCertificate size={14} />}
//                             rightSection={!user.cvFileName && <Badge>NEW</Badge>}
//                         >CV Upload</Tabs.Tab> */}
//                     </Tabs.List>

//                     <Tabs.Panel value="timeline" pt="xs">
//                         <div className='m-10 flex justify-center'>
//                             <MainTimeline user={user}/>
//                         </div>
//                     </Tabs.Panel>

//                     <Tabs.Panel value="team" pt="xs">
//                         {!team && <p>You do not have a team yet</p>}
//                         {(team && !team.timeslot) && <p>Book a slot</p>}
//                         {(team && team.timeslot) && <p>Your slot is at {team.timeslot}</p>}
//                     </Tabs.Panel>

//                     <Tabs.Panel value="profile" pt="xs">
//                         <Profile user={user}/>
//                     </Tabs.Panel>

//                     <Tabs.Panel value="cv" pt="xs">
//                         <CvUpload fileName={user.cvFileName || ''}/>
//                     </Tabs.Panel>
//                 </Tabs>





//             </main>
//         </div>
//     );
// }

const participation: Record<string, string> = {
    'Place me in a team': 'place in team',
    'I have a partial team and we are looking for more members': 'partial team',
    'I have a full team ready (from 1 to 4 people)': 'full team',
}

interface RegisterProps {
    session: Session
}

export default function Home({ session, user, team }: { session: Session, user: User, team: Team }) {

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const router = useRouter();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const valueTooLongMessage = 'Please use less than 250 characters, Please contact society@ecs.soton.ac.uk if you have any concerns'
    const valueTooLongShorterMessage = 'Please use less than 50 characters'

    const form = useForm({
        initialValues: {
            fullName: '',
            discordUsername: '',
            intro: '',
            participation: 'Place me in a team',
            teamMember1: '',
            teamMember2: '',
            teamMember3: '',
            teamMember4: '',
            dietaryReq: '',
            howDidHear: '',
            agreePhotos: false,
        },

        validate: {
            fullName: (value) => (value.length > 50 ? valueTooLongShorterMessage : null),
            discordUsername: (value) => (value.length > 50 ? valueTooLongShorterMessage : null),
            intro: (value) => (value.length > 250 ? valueTooLongMessage : null),
            participation: (value) => (!Object.keys(participation).includes(value) ? 'Please enter a valid entry' : null),
            teamMember1: (value) => (value.length > 50 ? valueTooLongShorterMessage : null),
            teamMember2: (value) => (value.length > 50 ? valueTooLongShorterMessage : null),
            teamMember3: (value) => (value.length > 50 ? valueTooLongShorterMessage : null),
            teamMember4: (value) => (value.length > 50 ? valueTooLongShorterMessage : null),
            dietaryReq: (value) => (value.length > 2000 ? valueTooLongMessage : null),
            howDidHear: (value) => (value.length > 50 ? valueTooLongShorterMessage : null),
        },
    });

    const [formLoading, setFormLoading] = useState(false);

    const submitForm = async (values: {
        fullName: string,
        discordUsername: string,
        intro: string,
        participation: string,
        teamMember1: string,
        teamMember2: string,
        teamMember3: string,
        teamMember4: string,
        dietaryReq: string,
        howDidHear: string,
        agreePhotos: boolean,
    }) => {

        if (!values.agreePhotos) {
            form.setErrors({
                agreePhotos: 'You must agree to proceed'
            });
            return;
        }

        setFormLoading(true)

        const submissionValues = {
            fullName: values.fullName,
            discordUsername: values.discordUsername,
            intro: values.intro,
            participation: values.participation,
            teamMember1: values.teamMember1,
            teamMember2: values.teamMember2,
            teamMember3: values.teamMember3,
            teamMember4: values.teamMember4,
            dietaryReq: values.dietaryReq,
            howDidHear: values.howDidHear,
            agreePhotos: values.agreePhotos,
        }

        const res = await fetch("/hackathon/api/v1/newRegister", {
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
        } else {
            console.log(res2)
        }
    } 

    return (
    <div>
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


        <main className="flex flex-col items-center justify-center w-screen flex-1 px-2 text-center">

            <div className='flex flex-row justify-center'>
                {dark ? <NextImage
                    className='max-h-72'
                    src={darkIcon}
                    alt="Fusion ECSS hackathon logo"
                    style={{ objectFit: 'contain' }}
                /> : <NextImage
                    className='max-h-72'
                    src={lightIcon}
                    alt="Fusion ECSS hackathon logo"
                    style={{ objectFit: 'contain' }}
                />}

            </div>


            <div>
                <Text>
                    Welcome to HackStart!
                    Meet us in <Text variant="link" component="a" href="https://data.southampton.ac.uk/building/60.html">Building 60</Text> on Saturday 27th September at 10:00am.
                </Text>
            </div>

            {user?.fullName && (
                <div className="mt-10 text-xl">
                    <Text>
                        You have already made a submission. If you need to make any changes, please contact a member of the committee.
                    </Text>
                </div>
            )}

            {!user?.fullName && (<div>
                <form className='w-full max-w-2xl mt-10 space-y-7'
                        onSubmit={form.onSubmit(submitForm)}>
                    <TextInput 
                        withAsterisk
                        label="Full Name"
                        {...form.getInputProps('fullName')}
                    />
                    <TextInput 
                        label="Discord Username"
                        {...form.getInputProps('discordUsername')}
                    />
                    <TextInput
                        label="Introduce yourself and your skills (Max 250 characters)"
                        {...form.getInputProps('intro')}
                    />
                    <NativeSelect
                        data={Object.keys(participation)}
                        label="How are you participating in the hackathon?"
                        {...form.getInputProps('participation')}
                    />
                    <TextInput
                        label="Name of Team Member 1"
                        {...form.getInputProps('teamMember1')}
                    />
                    <TextInput
                        label="Name of Team Member 2"
                        {...form.getInputProps('teamMember2')}
                    />
                    <TextInput
                        label="Name of Team Member 3"
                        {...form.getInputProps('teamMember3')}
                    />
                    <TextInput
                        label="Name of Team Member 4"
                        {...form.getInputProps('teamMember4')}
                    />

                    <TextInput
                        label="Do you have any dietary requirements?"
                        {...form.getInputProps('dietaryReq')}
                    />

                    <TextInput
                        label="How did you hear about us"
                        {...form.getInputProps('howDidHear')}
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
            )}
        </main>
    </div>
    );
    
};

export async function getServerSideProps(context: { req: (IncomingMessage & { cookies: NextApiRequestCookies; }) | NextApiRequest; res: ServerResponse | NextApiResponse<any>; }) {

    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session?.microsoft.email) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        }
    }

    if (!session?.discord.tag) {

        try {
            const sotonVerifyData = await axios({
                method: 'GET',
                url: `https://sotonverify.link/api/v2/user?sotonId=${session.microsoft.email.split('@')[0]}`,
                headers: {
                    Authorization: String(process.env.SOTON_VERIFY_API_AUTH)
                },
                data: {
                    guildId: '1008673689665032233',
                }
            })

            await prisma.user.update({
                data: {
                    discordTag: sotonVerifyData.data.discordTag,
                    discordId: sotonVerifyData.data.discordId,
                },
                where: {
                    sotonId: session.microsoft.email.split('@')[0],
                }
            })

        } catch {
            console.log('get fucked')
        }


    }

    const user = await prisma.user.findUnique({
        where: {
            sotonId: session.microsoft.email.split('@')[0],
        },
        include: {
            team: true
        },
    });

    if (user) {
        user.cv = null
    }


    return {
        props: {
            session,
            user: JSON.parse(JSON.stringify(user)),
            team: JSON.parse(JSON.stringify(user?.team)) || false,
        },
    }
}
