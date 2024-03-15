import {Checkbox, Text, useMantineColorScheme} from '@mantine/core';
import {icons} from '../pages/register';
import {User} from "@prisma/client";
import {EditableDataField} from "@/components/EditableDataField";

export function Profile({user}: { user: User }) {

    const {colorScheme} = useMantineColorScheme();


    return (
        <div className='flex justify-center'>
            <div className='flex gap-4 flex-col w-1/3'>

                <EditableDataField title='Name' data={String(user.firstName + ' ' + user.lastName)} editable={false}/>
                <EditableDataField title='Discord name' data={String(user.discordTag)} editable={false}/>
                <EditableDataField title='Southampton email' data={String(user.sotonId + '@soton.ac.uk')} editable={false}/>

                <EditableDataField title='Your CV' data={String(user.cvFileName || 'None uploaded')} editable={false}/>

                <Checkbox
                    checked={user.photoConsent || undefined}
                    readOnly={true}
                    label="Photo consent"
                />

                <Checkbox readOnly={true} checked={user.registered} label="Registered"/>
                <Checkbox readOnly={true} checked={user.checkedIn} label="Checked in"/>

                <div className='flex flex-row'>
                    <div className='flex flex-col'>
                        <Text size="sm" color="dimmed">Languages known</Text>
                        {/*<ActionIcon onClick={() => setEditing(!editing)}>*/}
                        {/*    <IconEdit  color='#868eb2' size={18} />*/}
                        {/*</ActionIcon>*/}
                        <div className='pt-2 flex flex-row w-16 flex-wrap'>
                            {user.tags.map(t => {
                                const Icon = icons[t];
                                return (<Icon key={t}/>);
                            })}
                        </div>
                    </div>
                </div>

                <EditableDataField title='Year of Study' data={String(user.yearOfStudy)} editable={false}/>

                <EditableDataField title='Dietary requirement' data={String(user.dietaryReq)} editable={false}/>

                <EditableDataField title='Extra info' data={String(user.extra)} editable={false}/>
            </div>
        </div>
    );
}
