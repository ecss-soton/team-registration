import {IconHeart, IconLock, IconLockOpen} from '@tabler/icons';
import {
    Card, Image, Text, Group, Badge, Button, ActionIcon, createStyles, Box, Container, Tooltip, Table
} from '@mantine/core';
import {Tag, Team} from '@/types/types';
import {icons} from '../pages/register';

export interface BadgeCardProps extends Team {
    teamName: string;
    userIsAdmin: boolean;
}


export function TeamCard(team: Team) {

    const userIsAdmin = false;

    const rows = team.members.map(m => (
        <tr key={m.discordTag}>
            <td>{m.firstName}</td>
            <td>{m.discordTag}</td>
            <td>
                {
                    m.tags.map(t => {
                        const Icon = icons[t];
                        return (<Icon key={t}/>);
                    })
                }
            </td>
            <td>{m.yearOfStudy}</td>
        </tr>
    ));

    return (
        <Card className="m-5" withBorder radius="md" p="md">

            <Card.Section className="p-4" mt="md">
                <Text size="lg" weight={500}>
                    Members
                </Text>
                <Table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Discord</th>
                        <th>Languages</th>
                        <th>Year</th>
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Card.Section>

            <Group mt="xs">
                <Button radius="md" disabled={team.locked}>
                    Join team
                </Button>
                {/* TODO Get the z index correct so that the tooltip can escape the group card. */}
                <Tooltip label="You must be an admin to lock/unlock a team." disabled={userIsAdmin}>
                    <ActionIcon variant="default" radius="md" size={36} disabled={!userIsAdmin}>
                        {team.locked ? <IconLock size={18} stroke={1.5}/> : <IconLockOpen size={18} stroke={1.5}/>}
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Card>
    );
}