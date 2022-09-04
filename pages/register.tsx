import {MultiSelect, NativeSelect, Switch} from '@mantine/core';
import { IconCheck } from '@tabler/icons';

export default function Home() {
    return (
        <>

            <NativeSelect
                data={['1st year', '2nd year', '3rd year', 'postgraduate']}
                placeholder="Pick one"
                label="Which year are you in?"
                description="This is anonymous"
                // withAsterisk={true}
            />

            <MultiSelect
                data={['Rust', 'Typescript', 'Javascript', 'Java', 'Python', 'C', 'C++', 'C#', 'Ruby', 'Kotlin', 'SQL']}
                label="What languages do you know"
                placeholder="Pick all that you like"
                searchable
                nothingFound="Nothing found"
            />

            <Switch
                label="I already have a team"
            />
        </>
    );
}