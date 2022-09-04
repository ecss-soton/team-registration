import { Timeline, Text, Button } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import {useRouter} from "next/router";

export const MainTimeline = () => {

    const router = useRouter()

    const handleClick = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        router.push('/register')
    }

    return (
        <Timeline active={1} bulletSize={24} lineWidth={2}>
            <Timeline.Item bullet={<IconCheck size={14}/>} title="Hackathon registration opens">
                <Text size="xs" mt={4}>7th September 8:00pm</Text>
                <Button onClick={handleClick}> Register </Button>
            </Timeline.Item>

            <Timeline.Item title="Hackathon begins">
                <Text size="xs" mt={4}>7th September 8:00pm</Text>
                <Text color="dimmed" size="sm">Make sure to be well rested for a hackathon in Zepler!</Text>
            </Timeline.Item>

            <Timeline.Item title="Something else happens">
                <Text size="xs" mt={4}>7th September 8:00pm</Text>
                <Text color="dimmed" size="sm">Wow maybe a game will happen or something idk</Text>
            </Timeline.Item>

            <Timeline.Item title="Lunch">
                <Text size="xs" mt={4}>7th September 8:00pm</Text>
                <Text color="dimmed" size="sm">Wow maybe a game will happen or something idk</Text>
            </Timeline.Item>

            <Timeline.Item title="Prize giving">
                <Text size="xs" mt={4}>7th September 8:00pm</Text>
                <Text color="dimmed" size="sm">Lots of prizes to give</Text>
            </Timeline.Item>
        </Timeline>
    );
}