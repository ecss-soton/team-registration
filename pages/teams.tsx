import {TeamCard} from '@/components/TeamCard';
import {Button, Card, Checkbox} from '@mantine/core';
import {useState} from 'react';
import {Team} from '@/types/types';
import useSWR from 'swr';
import fetcher from '../middleware/fetch';
import Link from "next/link";

export default function Teams() {

    const {data, mutate} = useSWR<{
        yourTeam?: string, yourRank?: number, teams: Team[]
    }>('/api/v1/teams', fetcher, {refreshInterval: 3000});

    const [buttonLoading, setButtonLoading] = useState(false);
    const [showJoinable, setShowJoinable] = useState(false);

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

    if (data && data.teams.length != 0) {
        data.teams.sort(t => t.id === data.yourTeam ? 0: 1)
    }


    return (
        <>
            <div className="flex flex-wrap flex-row">
                <Link href="/" passHref>
                    <Button variant='outline' className='m-5' component="a">
                        Back
                    </Button>
                </Link>
                <Button  className="m-5" loading={buttonLoading} onClick={createNewTeam}>
                    Create new team
                </Button>
                <Checkbox className='m-5' checked={showJoinable} label="Only show teams you can join" onChange={(event) => setShowJoinable(event.currentTarget.checked)} />
            </div>
            <div className="flex flex-wrap max-w-xl">
                {data ? (data.teams.length == 0 ? null : data.teams.map(v => {
                    if (v.id === data.yourTeam) {
                        return (<TeamCard key={v.id} userRank={data.yourRank} {...v} />);
                    }
                    if (showJoinable && (v.locked || v.members.length >= 4)) {
                        return null;
                    }
                    return (<TeamCard key={v.id} {...v}/>);
                })) : <div/>}

            </div>
        </>
    );
}

Teams.auth = true;