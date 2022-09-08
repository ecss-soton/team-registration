import {
  MultiSelect,
  NativeSelect,
  Box,
  CloseButton,
  SelectItemProps,
  MultiSelectValueProps,
  TextInput, Checkbox, SelectItem
} from '@mantine/core';

import {Tag} from '@/types/types'

import { forwardRef, FunctionComponent } from 'react';
import {
  COriginal,
  CplusplusOriginal, CsharpOriginal,
  JavaOriginal,
  JavascriptOriginal,
  KotlinPlain, PythonOriginal, RubyPlain,
  RustPlain, SqlitePlain,
  TypescriptOriginal
} from 'devicons-react';


const langData: (SelectItem & {value: Tag})[] = [
  { label: 'Rust', value: 'rs' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'Javascript', value: 'js' },
  { label: 'Typescript', value: 'ts' },
  {label: 'Kotlin', value: 'kt'},
  {label: 'C#', value: 'cs'},
  {label: 'Ruby', value: 'rb'},
  {label: 'SQL', value: 'sql'},
  {label: 'Python', value: 'py'},
  {label: 'C', value: 'c'}
];

const icons: Record<Tag, FunctionComponent> = {
    "rs": RustPlain,
    "java": JavaOriginal,
    "cpp": CplusplusOriginal,
    "js": JavascriptOriginal,
    "ts": TypescriptOriginal,
    "kt": KotlinPlain,
    "cs": CsharpOriginal,
    "rb": RubyPlain,
    "sql": SqlitePlain,
    "py": PythonOriginal,
    "c": COriginal
};

function Value({
  value,
  label,
  onRemove,
  classNames,
  ...others
}: MultiSelectValueProps & { value: Tag }) {
  const Icon = icons[value];
  return (
    <div {...others}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          cursor: 'default',
          alignItems: 'center',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]}`,
          paddingLeft: 10,
          borderRadius: 4,
        })}
      >
        <Box mr={10}>
          <Icon />
        </Box>
        <Box sx={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          size={22}
          iconSize={14}
          tabIndex={-1}
        />
      </Box>
    </div>
  );
}

// eslint-disable-next-line react/display-name
const Item = forwardRef<HTMLDivElement, SelectItemProps>(({ label, value, ...others }, ref) => {
  // Cannot be undefined
  const Flag = icons[value as Tag];
  return (
    <div ref={ref} {...others}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box mr={10}>
          <Flag />
        </Box>
        <div>{label}</div>
      </Box>
    </div>
  );
});


export default function Home() {
    return (
        <>

            <NativeSelect
                data={['1st year', '2nd year', '3rd year', '4th year', 'postgraduate']}
                placeholder="Pick one"
                label="Which year are you in?"
                description="This is anonymous"
                // withAsterisk={true}
            />

            <MultiSelect
                data={langData}
                valueComponent={Value}
                itemComponent={Item}
                searchable
                nothingFound="Nothing found"
                label="What programming languages do you know?"
            />

            <TextInput
              label="Do you have any dietary requirements?"
            />

            <TextInput
              label="Anything else we should know?"
            />

            <Checkbox
              label="I agree that by participating in the event my picture may be taken."
            />

        </>
    );
}