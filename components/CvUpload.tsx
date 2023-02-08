import { useState, useRef } from 'react';
import {FileButton, Button, Group, Text, Divider} from '@mantine/core';
import {IncomingMessage, ServerResponse} from "http";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {NextApiRequest, NextApiResponse} from "next";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "../pages/api/auth/[...nextauth]";
import axios from "axios";
import prisma from "../prisma/client";

export function CvUpload({ fileName }: { fileName: string}) {

    const KB_IN_BYTES = 1_024
    const MB_IN_BYTES = 1_048_576

    const MAX_FILE_SIZE = 10 * MB_IN_BYTES

    const tooBig = (file: File | null) => {
        if (file) return file.size > MAX_FILE_SIZE
    }

    const [file, setFile] = useState<File | null>(null);
    const [fileSizeError, setFileSizeError] = useState(false);
    const [generalFileError, setGeneralFileError] = useState(false);
    const [currentCvFileName, setCurrentCvFileName] = useState(fileName || 'None');
    const resetRef = useRef<() => void>(null);

    const clearFile = async () => {

        await fetch("/api/v1/uploadcv", {
            method: "delete",
        })

        setFile(null);
        setFileSizeError(false)
        setCurrentCvFileName('None')
        resetRef.current?.();
    };

    const uploadFile = async () => {
        if (tooBig(file)) {
            setFileSizeError(true)
            return;
        }

        const formData = new FormData();
        formData.append('cv', file || '');

        const res = await fetch("/api/v1/uploadcv", {
            method: "post",
            body: formData
        })
        const res2 = await res.json()
        if (!res2.success) {
            setGeneralFileError(true);
            return;
        }

        setFile(null);
        setCurrentCvFileName(res2.fileName)
        resetRef.current?.();
    }

    const printFileSize = (size: number) => {
        if (size < KB_IN_BYTES) return size.toFixed(2) + " Bytes"
        if (size < MB_IN_BYTES) return (size / KB_IN_BYTES).toFixed(2) + " KB"
        else return (size / MB_IN_BYTES).toFixed(2) + " MB"
    }

    return (
        <>
            <div className='p-10'>
                <Group position="center">
                    <FileButton onChange={setFile} accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                        {(props) => <Button variant="outline" {...props}>Upload CV</Button>}
                    </FileButton>
                    <Button color="red" onClick={clearFile}>Reset</Button>
                    <Button disabled={!file} onClick={uploadFile}>Submit</Button>
                </Group>
                {(fileSizeError || (file && tooBig(file))) && <Text size="sm" color="red" align="center" mt="sm">
                    File is bigger than {printFileSize(MAX_FILE_SIZE)}
                </Text>}
                {generalFileError && <Text size="sm" color="red" align="center" mt="sm">
                    Whoops! Something went wrong on the upload, please contact the web officer
                </Text>}
                {file && (
                    <Text size="sm" align="center" mt="sm">
                        {file.name} ({printFileSize(file.size)} Bytes)
                    </Text>
                )}
            </div>
            <div className='pt-2 flex flex-col'>
                <Text>Current CV: {currentCvFileName}</Text>
            </div>
        </>
    );
}