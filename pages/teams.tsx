import { TeamCard } from '@/components/TeamCard';
import { Button, Card } from '@mantine/core';
import { useState } from 'react';
import { Team } from '@/types/types';
import useSWR from 'swr';
import fetcher from '../middleware/fetch';

export default function Teams () {

  const { data, mutate } = useSWR<{
    yourTeam?: string, yourRank?: number, teams: Team[]
  }>('/api/v1/teams', fetcher, { refreshInterval: 3000 });

  const [buttonLoading, setButtonLoading] = useState(false);

  const createNewTeam = async () => {
    setButtonLoading(true);

    const res = await fetch('/api/v1/join', {
      method: 'post', headers: {
        'Accept': 'application/json', 'Content-Type': 'application/json'
      },

      //make sure to serialize your JSON body
      body: JSON.stringify({})
    });

    if (res.ok) {
      await mutate();
      setButtonLoading(false);
    }
  };

  return (<>
    <div className="flex flex-wrap">
      {data ? (data.teams.length == 0 ? null : data.teams.map(v => {
        if (v.id === data.yourTeam) {
          return (<TeamCard key={v.id} userRank={data.yourRank} {...v} />);
        }
        return (<TeamCard key={v.id} {...v}/>);
      })) : <div/>}
      <Card className="m-5" withBorder radius="md" p="md">
        <Button loading={buttonLoading} onClick={createNewTeam}>
          Create new team
        </Button>
      </Card>
    </div>
  </>);
}

