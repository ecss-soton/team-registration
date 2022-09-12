import {Timeline, Text, Button, Tooltip} from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import Link from "next/link";
import { useState } from 'react';
import moment from "moment";
import type { User } from "@prisma/client"


const stages = [
    {
        title: "Hackathon registration opens",
        date: new Date("19 september 2022 12:00:00"),
        content: (
            <Link href="/register" passHref>
                <Button component="a">Register</Button>
            </Link>
        )
    },
    {
        title: "Choose a team",
        content: (
            <Text color="dimmed" size="sm">Make sure to be well rested for a hackathon in Zepler!</Text>
        )
    },
    {
        title: "Discuss ideas",
        content: (
            <Link href="/register" passHref>
                <Button component="a">Register</Button>
            </Link>
        )
    },
    {
        title: "Hackathon starts",
        date: new Date("1 october 2022 10:00:00"),
        content: (
            <Link href="/register" passHref>
                <Button component="a">Register</Button>
            </Link>
        )
    },
    {
        title: "Mario kart",
        date: new Date("1 october 2022 11:00:00"),
        content: (
            <Link href="/register" passHref>
                <Button component="a">Register</Button>
            </Link>
        )
    },
    {
        title: "Lunch",
        date: new Date("1 october 2022 13:00:00"),
        content: (
            <Link href="/register" passHref>
                <Button component="a">Register</Button>
            </Link>
        )
    },
    {
        title: "Prize giving",
        date: new Date("1 october 2022 22:00:00"),
        content: (
            <Link href="/register" passHref>
                <Button component="a">Register</Button>
            </Link>
        )
    }
]

export const MainTimeline = ({ user }: { user: User }) => {

    let stage = 0;

    if (user.yearOfStudy) {
        stage = 1
    }



    return (
        <Timeline active={stage} bulletSize={24} lineWidth={2}>
            {stages.map((v, i) => {
                if (i <= stage - 1) { // Done that stage
                    return (
                        <Timeline.Item key={v.title} bullet={<IconCheck size={14}/>} title={v.title}>
                            {
                                !v.date ? null :
                                    <Tooltip label={new Date(v.date).toString()}>
                                        <Text size="xs" mt={4}>{moment(v.date).fromNow()}</Text>
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
                                        <Text size="xs" mt={4}>{moment(v.date).format("dddd, MMMM Do, h:mm a")}</Text>
                                    </Tooltip>
                            }
                            {v.content}
                        </Timeline.Item>
                    )
                } else { // Not yet shown
                    return (
                        <Timeline.Item key={v.title} title={v.title}>
                            {
                                !v.date ? null :
                                    <Tooltip label={new Date(v.date).toString()}>
                                        <Text size="xs" mt={4}>{moment(v.date).fromNow()}</Text>
                                    </Tooltip>
                            }
                        </Timeline.Item>
                    )
                }

            })}
        </Timeline>
    );
}