import {Button, Text, Timeline} from '@mantine/core';
import {IconCheck} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import moment from "moment";
import type {User} from "@prisma/client"

const stages = [
    {
        title: "Hackathon registration opens",
        date: new Date("20 september 2024 09:00:00"), // TODO
        content: ({ registered }: User) => (
            <div className='flex flex-row'>
                {!registered &&
                    <Button component="a" href={"/hackathon/register"}>Register</Button>
                }
                {/*<div className='w-1/2'>*/}
                {/*    <AddToCalendarButton // https://add-to-calendar-button.com/en/configuration#style-parameters*/}
                {/*        trigger="click"*/}
                {/*        buttonStyle="flat"*/}
                {/*        hideBackground*/}
                {/*        hideCheckmark*/}
                {/*        size='1|1|1'*/}

                {/*        name="Aleios Hackathon"*/}
                {/*        description="Hackathon run by ECSS"*/}
                {/*        startDate="2023-02-11"*/}
                {/*        startTime="10:00"*/}
                {/*        endDate="2023-02-12"*/}
                {/*        endTime="15:00"*/}
                {/*        location="Building 16"*/}

                {/*        options={['Apple','Google','Yahoo',"iCal"]}*/}
                {/*    ></AddToCalendarButton>*/}
                {/*</div>*/}
            </div>
        )
    },
    {
        title: "Choose a team",
        content: () => (
            <>
                <Text>Create or join a team and meet new people!</Text>
            </>
        ),
        hidden: ({ teamId }: User) => (
            <>
                {!teamId &&
                    <Button className='mt-3' component="a" href={"/hackathon/teams"}>Join a team</Button>
                }
            </>
        )
    },
    {
        title: "Arrive",
        date: new Date("28 september 2024 10:00:00"),
        content: ({ registered }: User) => (
            <div>
                <Text>Turn up to <Text variant="link" component="a" href="https://data.southampton.ac.uk/building/60.html">Building 60</Text> and check in with the helpers</Text>
                {registered &&
                    <Button className='mt-3' component="a" href={"/hackathon/qr"}>View sign in QR code</Button>
                }
            </div>
        )
    },
    {
        title: "Theme presentation and introduction talk",
        date: new Date("28 september 2024 10:30:00"),
        content: () => (
            <Text>Find out the theme for this hackathon</Text>
        )
    },
    // {
    //     title: "Lunch",
    //     date: new Date("16 march 2024 14:00:00"),
    //     content: () => (
    //         <Text>Midway refuel!</Text>
    //     )
    // },
    // {
    //     title: "Team paper aeroplane competition",
    //     date: new Date("16 march 2024 12:00:00"),
    //     content: (
    //         <Text>Test your engineering ability and craft a paper plane. The furthest wins!</Text>
    //     )
    // },
    // {
    //     title: "Wikiraces competition",
    //     date: new Date("1 october 2022 15:00:00"),
    //     content: (
    //         <Text>What links Southampton and digital watches? No clue? Follow the wikipedia links to find out!</Text>
    //     )
    // },
    // {
    //     title: "S'hack Zone Opens",
    //     date: new Date("16 march 2024 18:00:00"),
    //     content: () => (
    //         <Text>All that hacking gets tiring, so take a bean bag and chill out!</Text>
    //     )
    // },
    // {
    //     title: "Dinner",
    //     date: new Date("16 march 2024 19:00:00"),
    //     content: () => (
    //         <Text>Enjoy some well-earned pizza!</Text>
    //     )
    // },
    // {
    //     title: "Challenges and Tournaments",
    //     date: new Date("16 march 2024 20:00:00"),
    //     content: () => (
    //         <Text>Compete in some fun challenges to earn prizes!</Text>
    //     )
    // },
    // {
    //     title: "Breakfast",
    //     date: new Date("17 march 2024 09:00:00"),
    //     content: () => (
    //         <Text>All that hacking gets tiring, refuel with some free cookies!</Text>
    //     )
    // },
    // {
    //     title: "Lunch 2",
    //     date: new Date("17 march 2024 11:30:00"),
    //     content: () => (
    //         <Text>Your second lunch</Text>
    //     )
    // },
    // // {
    // //     title: "Mario Kart tournament",
    // //     date: new Date("1 october 2022 19:00:00"),
    // //     content: (
    // //         <Text>Join the Mario Kart tournament to see who can go round Rainbow road the fastest</Text>
    // //     )
    // // },
    // {
    //     title: "Project submission deadlines",
    //     date: new Date("17 march 2024 12:00:00"),
    //     content: () => (
    //         <Text>Add your finishing touches to your project before your final submission</Text>
    //     ),
    //     hidden: () => (
    //         <>
    //             <Button className='mt-3' component="a" href={"/hackathon/submit"}>Submit your project</Button>
    //         </>
    //     )
    // },
    // {
    //     title: "Team presentations",
    //     date: new Date("17 march 2024 12:45:00"),
    //     content: () => (
    //         <Text>Show us what you have created!</Text>
    //     )
    // },
    // {
    //     title: "Winners announced",
    //     date: new Date("17 march 2024 15:00:00"),
    //     content: () => (
    //         <Text>Prizes will be given out the members of the top 4 teams</Text>
    //     )
    // }
]

export const MainTimeline = ({ user }: { user: User }) => {

    let stage = -1;
    if (user.registered) stage++;
    if (user.teamId) stage++;

    const now = Date.now();

    for (const event of stages) {
        if (event.date) {
            if (now > event.date.getTime()) {
                stage++;
            }
        }
    }

    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <Timeline active={stage} bulletSize={24} lineWidth={2}>
            {stages.map((v, i) => {
                if (i <= stage - 1) { // Done that stage
                    return (
                        <Timeline.Item key={v.title} bullet={<IconCheck size={14}/>} title={v.title}/>
                    )
                } else if (i <= stage) { // Doing this stage
                    return (
                        <Timeline.Item styles={(theme) => ({
                            itemBullet: {
                                backgroundColor: '#8000ff',
                                borderColour: '#8000ff',
                            }
                        })} key={v.title} title={v.title}>
                            {
                                !v.date ? null :
                                    <Text size="xs" color="dimmed" mt={4}>{moment(v.date).format("dddd, MMMM Do, h:mm a")}</Text>
                            }
                            <Text size="sm">
                                {v.content(user)}
                            </Text>
                            {v.hidden && v.hidden(user)}
                        </Timeline.Item>
                    )
                } else { // Not yet shown
                    return (
                        <Timeline.Item key={v.title} title={v.title}>
                            {
                                !v.date ? null :
                                    <Text size="xs" color="dimmed" mt={4}>{moment(v.date).format("dddd, MMMM Do, h:mm a")}</Text>
                            }
                            <Text size="sm">
                                {v.content(user)}
                            </Text>
                        </Timeline.Item>
                    )
                }

            })}
        </Timeline>
    );
}
