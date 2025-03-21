import {MainTimeline} from "@/components/Timeline"
import {getServerSession, Session} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import {IncomingMessage, ServerResponse} from "http";
import {NextApiRequest, NextApiResponse} from "next";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {Team, User} from "@prisma/client";
import prisma from "../prisma/client";
import NextImage from "next/image";
import {ActionIcon, Badge, Button, Tabs, Text, useMantineColorScheme} from "@mantine/core";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import {IconCertificate, IconMoonStars, IconSun, IconTimeline, IconUserCircle, IconUsers} from "@tabler/icons-react";
import {CvUpload} from "@/components/CvUpload";
import {useRouter} from "next/router";
import darkIcon from '../public/sotonhacktrans.png';
import lightIcon from '../public/sotonhacktrans.png'
import {Profile} from "@/components/Profile";

export default function Home({ session, user, team }: { session: Session, user: User, team: Team }) {

    const router = useRouter()
    let { tab } = router.query

    if (Array.isArray(tab)) tab = tab[0]

    const tabs = ['profile', 'timeline', 'team', 'cv']
    if (tab && !tabs.includes(tab)) tab = undefined

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

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
                        Welcome to SotonHack!
                        Meet us in <Text variant="link" component="a" href="https://data.southampton.ac.uk/building/60.html">Building 60</Text> on Saturday 15th March at 10:00am.
                    </Text>

                    <div className='flex flex-row flex-wrap justify-center'>
                        <Button
                            styles={{ root: { backgroundColor: '#5865F2', '&:hover': { backgroundColor: '#3c48d2' } } }}
                            leftIcon={<FontAwesomeIcon icon={faDiscord} className='text-white text-lg h-4 w-5'/>}
                            target='_blank'
                            href={'https://discord.gg/pnKCFpy4'}
                            component="a"
                            className='m-3'>
                            Join discord
                        </Button>

                        <Button className='m-3' component="a" href={"/hackathon/register"}>Register Here</Button>

                        <Button className='m-3' component="a" href={"/hackathon/teams"}>View teams</Button>

                        <Button className='m-3' component="a" href={"/hackathon/qr"}>Sign in QR code</Button>

                        {new Date() > new Date("16 march 2024 11:00:00") &&
                            <Button variant="outline" className='m-3' component="a" href={"/hackathon/submit"}>Submit your project</Button>
                        }
                    </div>


                </div>


                <Tabs defaultValue={tab || "timeline"} className='w-screen'>
                    <Tabs.List position="center">
                        <Tabs.Tab value="timeline" icon={<IconTimeline size={14} />}>Timeline</Tabs.Tab>
                        <Tabs.Tab value="team" icon={<IconUsers size={14} />}>Your Team</Tabs.Tab>
                        <Tabs.Tab value="profile" icon={<IconUserCircle size={14} />}>Profile</Tabs.Tab>
                        <Tabs.Tab
                            value="cv"
                            icon={<IconCertificate size={14} />}
                            rightSection={!user.cvFileName && <Badge>NEW</Badge>}
                        >CV Upload</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="timeline" pt="xs">
                        <div className='m-10 flex justify-center'>
                            <MainTimeline user={user}/>
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="team" pt="xs">
                        {!team && <p>You do not have a team yet</p>}
                        {(team && !team.timeslot) && <p>Book a slot</p>}
                        {(team && team.timeslot) && <p>Your slot is at {team.timeslot}</p>}
                    </Tabs.Panel>

                    <Tabs.Panel value="profile" pt="xs">
                        <Profile user={user}/>
                    </Tabs.Panel>

                    <Tabs.Panel value="cv" pt="xs">
                        <CvUpload fileName={user.cvFileName || ''}/>
                    </Tabs.Panel>
                </Tabs>





            </main>
        </div>
    );
}

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
