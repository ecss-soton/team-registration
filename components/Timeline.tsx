import {Timeline, Text, Button, Tooltip} from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import Link from "next/link";
import { useState } from 'react';
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
                <Text color="dimmed" size="sm">Create or join a team and meet new people!</Text>
                <Link href="/teams" passHref>
                    <Button component="a">View teams</Button>
                </Link>
            </>
        )
    },
    {
        title: "Arrive",
        date: new Date("1 october 2022 09:45:00"),
        content: (
            <Text>Turn up to this location and do cool things!</Text>
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
        date: new Date("1 october 2022 20:30:00"),
        content: (
            <Text>Add your finishing touches to your project before your final submission</Text>
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

    let stage = 0;

    if (user.yearOfStudy) {
        stage = 1
    }

    const now = Date.now();


    return (
        <Timeline active={stage} bulletSize={24} lineWidth={2}>
            {stages.map((v, i) => {
                if (i <= stage - 1) { // Done that stage
                    return (
                        <Timeline.Item key={v.title} bullet={<IconCheck size={14}/>} title={v.title}>
                            {
                                !v.date ? null :
                                    <Tooltip label={new Date(v.date).toString()}>
                                        <Text size="xs" color="dimmed" mt={4}>{moment(v.date).fromNow()}</Text>
                                    </Tooltip>
                            }
                        </Timeline.Item>
                    )
                } else if (i <= stage) { // Doing this stage
                    return (
                        <Timeline.Item key={v.title} title={v.title}>
                            {
                                !v.date ? null :
                                    <Tooltip label={new Date(v.date).toString()}>
                                        <Text size="xs" color="dimmed" mt={4}>{moment(v.date).format("dddd, MMMM Do, h:mm a")}</Text>
                                    </Tooltip>
                            }
                            <Text>
                                {v.content}
                            </Text>
                        </Timeline.Item>
                    )
                } else { // Not yet shown
                    return (
                        <Timeline.Item key={v.title} title={v.title}>
                            {
                                !v.date ? null :
                                    <Tooltip label={moment(v.date).fromNow()}>
                                        <Text size="xs" color="dimmed" mt={4}>{moment(v.date).format("dddd, MMMM Do, h:mm a")}</Text>
                                    </Tooltip>
                            }
                            <Text>
                                {v.content}
                            </Text>
                        </Timeline.Item>
                    )
                }

            })}
        </Timeline>
    );
}