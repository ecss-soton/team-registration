import { IconHeart } from '@tabler/icons';
import { Card, Image, Text, Group, Badge, Button, ActionIcon, createStyles } from '@mantine/core';
import {User} from "@prisma/client";

interface BadgeCardProps {
    teamName: string;
    members: User[];
}

export function TeamCard({ teamName, members }: BadgeCardProps) {

    const allTags = members.map(i => (i.tags));

    const features = allTags.map(tag => (
        <Badge
            key={tag[0]}
            // leftSection={badge.emoji}
        >
            {tag}
        </Badge>
    ));

    return (
        <Card className='m-5' withBorder radius="md" p="md" >

            <Card.Section className='p-4' mt="md">
                <Group position="apart">
                    <Text size="lg" weight={500}>
                        {teamName}
                    </Text>
                    <Badge size="sm">New</Badge>
                </Group>
            </Card.Section>

            <Card.Section className='p-4'>
                <Text mt="md" className='p-2' color="dimmed">
                    Languages
                </Text>
                <Group spacing={7} mt={5}>
                    {features}
                </Group>
            </Card.Section>

            <Group mt="xs">
                <Button radius="md">
                    Join team
                </Button>
                <ActionIcon variant="default" radius="md" size={36}>
                    <IconHeart size={18} stroke={1.5} />
                </ActionIcon>
            </Group>
        </Card>
    );
}