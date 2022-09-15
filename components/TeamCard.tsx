import { IconLock, IconLockOpen } from '@tabler/icons';
import {
  Card, Text, Group, Button, ActionIcon, Tooltip, Table
} from '@mantine/core';
import { Team } from '@/types/types';
import { icons } from '../pages/register';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

export function TeamCard (team: Team & { userRank?: number}) {
  const [lockButtonLoading, setLockButtonLoading] = useState(false);
  const [joinButtonLoading, setJoinButtonLoading] = useState(false);
  const {mutate} = useSWRConfig();

  const lockTeam = async () => {
    setLockButtonLoading(true);

    const res = await fetch('/api/v1/lock', {
      method: 'post', headers: {
        'Accept': 'application/json', 'Content-Type': 'application/json'
      },

      body: JSON.stringify({ shouldLock: !team.locked })
    });

    if (res.ok) {
      await mutate('/api/v1/teams', (oldData: any) => {
        // Need to deep copy the data
        let data: {
          yourTeam?: string, yourRank?: number, teams: Team[]
        } | undefined = JSON.parse(JSON.stringify(oldData));
        if (data) {
          let cachedTeam = data.teams.find((t) => t.id === team.id);
          if (cachedTeam) {
            cachedTeam.locked = !team.locked;
          }
        }
        return data;
      }, {populateCache: true, revalidate: false})
      setLockButtonLoading(false);
    }
  };

  const joinTeam = async () => {
    setJoinButtonLoading(true);

    const res = await fetch('/api/v1/join', {
      method: 'post', headers: {
        'Accept': 'application/json', 'Content-Type': 'application/json'
      },

      body: JSON.stringify({ team: team.id })
    });

    if (res.ok) {
      await mutate('/api/v1/teams')
      setJoinButtonLoading(false);
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
      <Button radius="md" disabled={team.locked || team.userRank !== undefined} loading={joinButtonLoading} onClick={joinTeam}>
        Join team
      </Button>
      {/* TODO Get the z index correct so that the tooltip can escape the group card. */}
      <Tooltip label="You must be an admin to lock/unlock a team." disabled={team.userRank === 0}>
        <ActionIcon variant="default" radius="md" size={36} disabled={team.userRank !== 0} loading={lockButtonLoading}
                    onClick={lockTeam}>
          {team.locked ? <IconLock size={18} stroke={1.5}/> : <IconLockOpen size={18} stroke={1.5}/>}
        </ActionIcon>
      </Tooltip>
    </Group>
  </Card>);
}