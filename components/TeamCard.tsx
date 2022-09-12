import { IconHeart, IconLock, IconLockOpen } from '@tabler/icons';
import {
  Card, Image, Text, Group, Badge, Button, ActionIcon, createStyles, Box, Container, Tooltip
} from '@mantine/core';
import { Member, Tag, Team } from '@/types/types';
import { icons } from '../pages/register';

export interface BadgeCardProps extends Team {
  teamName: string;
  userIsAdmin: boolean;
}


export function TeamCard ({ teamName, members, locked, userIsAdmin }: BadgeCardProps) {

  const membersCard = members.map(m => {
    const Tags = m.tags.map(t => {
      const Icon = icons[t];
      return (<Icon key={t}/>);
    })

    return (<Box key={m.name} sx={(theme) => ({
        display: 'flex',
        backgroundColor: theme.colors.gray[0],
        textAlign: 'center',
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
      })}>
        <Text size="md" weight="500">
          {m.name}
        </Text>
        <Text size="md" weight="500">
          {m.discordTag}
        </Text>
        {Tags}
      </Box>);
  });

  return (<Card className="m-5" withBorder radius="md" p="md">

      <Card.Section className="p-4" mt="md">
        <Group position="apart">
          <Text size="lg" weight={500}>
            Members
          </Text>
        </Group>
      </Card.Section>

      <Card.Section className="p-4">
        <Group spacing={7} mt={5}>
          {membersCard}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" disabled={locked}>
          Join team
        </Button>
        {/* TODO Get the z index correct so that the tooltip can escape the group card. */}
        <Tooltip label="You must be an admin to lock/unlock a team." disabled={userIsAdmin}>
          <ActionIcon variant="default" radius="md" size={36} disabled={!userIsAdmin}>
            {locked ? <IconLock size={18} stroke={1.5}/> : <IconLockOpen size={18} stroke={1.5}/>}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>);
}