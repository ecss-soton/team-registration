import {Button} from '@mantine/core';
import React from 'react';
import QRCode from "react-qr-code";
import {useSession} from "next-auth/react";

export default function Qr() {

    const {data: session} = useSession();

    return (
        <>
            <div className='flex flex-col content-center bg-white h-screen'>
                <div className='flex justify-center m-10'>
                    <Button variant='filled' component="a" href="/hackathon/">
                        Back
                    </Button>
                </div>
                <div className="flex justify-center mt-2">
                    {session && <QRCode
                        size={1024}
                        className='w-4/5 h-auto max-w-2xl'
                        value={session.id}
                        viewBox={`0 0 1024 1024`}
                    />}
                </div>
            </div>
        </>
    );
}

Qr.auth = true;
