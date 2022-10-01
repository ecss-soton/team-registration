import {Timeline, Text, Button, Tooltip} from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import Link from "next/link";
import {useEffect, useState} from 'react';
import moment from "moment";
import type { User } from "@prisma/client"


const stages = [
    {
        title: "Hackathon registration opens",
        date: new Date("27 september 2022 20:00:00"), // TODO
        content: (
            <Link href="/register" passHref>
                <Button component="a">Register</Button>
            </Link>
        )
    },
    {
        title: "Choose a team",
        content: (
            <>
                <Text>Create or join a team and meet new people!</Text>

            </>
        ),
        hidden: (
            <>
                <Link href="/teams" passHref>
                    <Button className='mt-3' component="a">View teams</Button>
                </Link>
            </>
        )
    },
    {
        title: "Arrive",
        date: new Date("1 october 2022 09:45:00"),
        content: (
            <Text>Turn up to <Text variant="link" component="a" href="https://data.southampton.ac.uk/building/16.html">Building 16</Text> and check in with the helpers</Text>
        )
    },
    {
        title: "Theme presentation and introduction talk",
        date: new Date("1 october 2022 10:30:00"),
        content: (
            <Text>Find out the theme for this hackathon</Text>
        )
    },
    {
        title: "Team paper aeroplane competition",
        date: new Date("1 october 2022 12:00:00"),
        content: (
            <Text>Test your engineering ability and craft a paper plane. The furthest wins!</Text>
        )
    },
    {
        title: "Wikiraces competition",
        date: new Date("1 october 2022 15:00:00"),
        content: (
            <Text>What links Southampton and digital watches? No clue? Follow the wikipedia links to find out!</Text>
        )
    },
    {
        title: "Pizza arrives",
        date: new Date("1 october 2022 18:00:00"),
        content: (
            <Text>All that hacking gets tiring, refuel with some free pizza!</Text>
        )
    },
    {
        title: "Mario Kart tournament",
        date: new Date("1 october 2022 19:00:00"),
        content: (
            <Text>Join the Mario Kart tournament to see who can go round Rainbow road the fastest</Text>
        )
    },
    {
        title: "Project submission deadlines",
        date: new Date("1 october 2022 20:15:00"),
        content: (
            <Text>Add your finishing touches to your project before your final submission</Text>
        ),
        hidden: (
            <>
                <Link href="/submit" passHref>
                    <Button className='mt-3' component="a">Submit your project</Button>
                </Link>
            </>
        )
    },
    {
        title: "Team presentations",
        date: new Date("1 october 2022 20:45:00"),
        content: (
            <Text>Show us what you have created!</Text>
        )
    },
    {
        title: "Winners announced",
        date: new Date("1 october 2022 22:00:00"),
        content: (
            <Text>Everyone gets a prize but the best projects get a big prize</Text>
        )
    }
]

export const MainTimeline = ({ user }: { user: User }) => {

    let stage = -1;

    const now = Date.now();

    if (user.yearOfStudy === null) {
        stage = 0;
    }
    else {
        stage++;
        for (const event of stages) {
            if (event.date) {
                if (now > event.date.getTime()) {
                    stage++;
                }
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
                        <Timeline.Item key={v.title} title={v.title}>
                            {
                                !v.date ? null :
                                    <Text size="xs" color="dimmed" mt={4}>{moment(v.date).format("dddd, MMMM Do, h:mm a")}</Text>
                            }
                            <Text size="sm">
                                {v.content}
                            </Text>
                            {v.hidden}
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
                                {v.content}
                            </Text>
                        </Timeline.Item>
                    )
                }

            })}
        </Timeline>
    );
}