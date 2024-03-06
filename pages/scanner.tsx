import {TeamCard} from '@/components/TeamCard';
import {Button, Card, Checkbox, TextInput} from '@mantine/core';
import React, {useState} from 'react';
import {Team} from '@/types/types';
import useSWR from 'swr';
import fetcher from '../middleware/fetch';
import Link from "next/link";
import QRCode from "react-qr-code";
import {useSession} from "next-auth/react";
import QrCodeReader from "react-qrcode-reader";

export default function Qr() {
    interface ICheckedIn {
        success: boolean
        dietaryReq: string
        extra: string
        displayName: string
    }

    const [data, setData] = useState<ICheckedIn>({ success: false, dietaryReq: 'N/A', extra: 'N/A', displayName: 'N/A' });
    const [showScanner, setShowScanner] = useState(true);
    const [manualID, setManualID] = useState('');


    const checkIn = async (id: string) => {
        setShowScanner(false)
        const res = await fetch("/hackathon/api/v1/checkin", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })

        const res2 = await res.json()
        console.log("scanner res2", res2)
        if (res2.success) {
            setData(res2);
        } else {
            setData({ success: false, dietaryReq: 'N/A', extra: 'N/A', displayName: res2.message || "Uh Oh! An error occurred" });
        }
    }

    return (
        <>
            <div className='flex flex-col content-center h-screen'>
                <div className='flex justify-center m-5 gap-4'>
                    <Button variant='outline' component="a" href={"/hackathon/"}>
                        Back
                    </Button>
                    <Button variant='filled' component="a" onClick={() => setShowScanner(!showScanner)}>
                        Toggle scanner
                    </Button>
                    <TextInput hidden={showScanner} value={manualID} onChange={(event) => setManualID(event.currentTarget.value)}/>
                    <Button hidden= {showScanner} variant='filled' component="a" onClick={() => checkIn(manualID)}>
                        Submit Id
                    </Button>
                </div>
                <div className='flex justify-center p-10'>
                    {
                        data.success ?
                            <div>
                                <div>Name: {data.displayName}</div>
                                <div>Dietary: {data.dietaryReq}</div>
                                <div>Extra: {data.extra}</div>
                            </div> :
                            <div>Error: {data.displayName}</div>
                    }
                </div>
                {
                    showScanner &&
                    <div className='w-1/3 m-10'>
                        <QrCodeReader delay={100} width={500} height={500} action={checkIn} />
                    </div>

                }
            </div>


        </>
    );
}

Qr.auth = true;
