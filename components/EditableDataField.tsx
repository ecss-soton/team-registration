import {IconEdit} from '@tabler/icons-react';
import {ActionIcon, Button, Input, Text, useMantineColorScheme} from '@mantine/core';
import {useState} from 'react';

interface EditableDataFieldProps {
    title: string
    data: string
    editable: boolean

}

export function EditableDataField(props: EditableDataFieldProps) {

    const { colorScheme } = useMantineColorScheme();

    const [editing, setEditing] = useState(false)


    return (
        <div className='flex justify-center flex-col'>
            <div className='flex flex-row place-items-center'>
                <Text size="sm" color="dimmed" className='pr-1'>{props.title}</Text>
                {
                    props.editable &&
                    <ActionIcon onClick={() => setEditing(!editing)}>
                        <IconEdit  color='#868eb2' size={18} />
                    </ActionIcon>
                }
            </div>
            {
                editing ?
                    <div className='flex flex-row'>
                        <Input variant="unstyled" placeholder={props.data}/>
                        <Button>Submit</Button>
                    </div> :
                    <Text className='flex flex-row'>{props.data}</Text>
            }
        </div>
    );
}
