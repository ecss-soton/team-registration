import { IconLock, IconLockOpen } from '@tabler/icons';
import {
  Card, Text, Group, Button, ActionIcon, Tooltip, Table
} from '@mantine/core';
import { Team } from '@/types/types';
import { icons } from '../pages/register';
import { useState } from 'react';

export interface BadgeCardProps extends Team {
  teamName: string;
  userIsAdmin: boolean;
}

export function TeamCard (team: Team & { userRank?: number }) {
  const [lockButtonLoading, setLockButtonLoading] = useState(false);
  const [locked, setLocked] = useState(team.locked);

  const lockTeam = async () => {
    setLockButtonLoading(true);

    const res = await fetch('/api/v1/lock', {
      method: 'post', headers: {
        'Accept': 'application/json', 'Content-Type': 'application/json'
      },

      body: JSON.stringify({ shouldLock: !locked })
    });

    if (res.ok) {
      setLocked(!locked);
      setLockButtonLoading(false);
    }
  };

  let memberCount = -1;
  const rows = team.members.map(m => {
    return (<tr key={m.discordTag} style={(memberCount += 1) === team.userRank ? { backgroundColor: '#e0e0e0' } : {}}>
      <td>{m.name}</td>
      <td>{m.discordTag}</td>
      <td>
        {m.tags.map(t => {
          const Icon = icons[t];
          return (<Icon key={t}/>);
        })}
      </td>
      <td>{m.yearOfStudy}</td>
    </tr>);
  });

  return (<Card className="m-5" withBorder radius="md" p="md">

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
      <Button radius="md" disabled={locked || team.userRank !== undefined}>
        Join team
      </Button>
      {/* TODO Get the z index correct so that the tooltip can escape the group card. */}
      <Tooltip label="You must be an admin to lock/unlock a team." disabled={team.userRank === 0}>
        <ActionIcon variant="default" radius="md" size={36} disabled={team.userRank !== 0} loading={lockButtonLoading}
                    onClick={lockTeam}>
          {locked ? <IconLock size={18} stroke={1.5}/> : <IconLockOpen size={18} stroke={1.5}/>}
        </ActionIcon>
      </Tooltip>
    </Group>
  </Card>);
}