import {Button, TextInput} from '@mantine/core';
import React, {useState, useEffect, useRef} from 'react';
import classes from '../styles/Qr.module.css';
import QrScanner from "qr-scanner";
import QrFrame from '../public/qr-frame.svg';
import Image from 'next/image';

export default function Qr() {
    interface ICheckedIn {
        success: boolean
        dietaryReq: string
        extra: string
        displayName: string,
        photoConsent: boolean,
        errorMsg: string
    }

    const [data, setData] = useState<ICheckedIn>({
        success: false,
        dietaryReq: 'N/A',
        extra: 'N/A',
        displayName: 'N/A',
        photoConsent: false,
        errorMsg: ''
    });
    const [manualID, setManualID] = useState('');


    const checkIn = async (id: string) => {
        toggleScanner(false)
        const res = await fetch("/hackathon/api/v1/checkin", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        })

        const data = await res.json()

        if (data.success) {
            setData({
                ...data,
                errorMsg: '',
            });
        } else {
            setData({
                success: false,
                dietaryReq: 'N/A',
                extra: 'N/A',
                displayName: 'N/A',
                photoConsent: false,
                errorMsg: data.message || "Uh Oh! An error occurred"
            });
        }
    }

    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(false);

    const onScanSuccess = (result: QrScanner.ScanResult) => {
        if (result?.data && !qrOn) {
            checkIn(result.data)
        }
    };

    // Fail
    const onScanFail = (err: string | Error) => {
        console.log(err);
    };

    const toggleScanner = (state?: boolean) => {

        if (!videoEl?.current) return;

        if (!scanner?.current) {

            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                onDecodeError: onScanFail,
                preferredCamera: "environment", // Front facing camera
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl?.current || undefined,
            });

            scanner.current?.start();
        }

        if (scanner?.current) {

            if (state === true) {
                scanner?.current?.start();
                setQrOn(true);
                return;
            }

            if (state === false) {
                scanner?.current?.stop();
                setQrOn(false);
                return;
            }

            if (qrOn) {
                scanner?.current?.stop();
                setQrOn(false);
                return;
            } else {
                scanner?.current?.start();
                setQrOn(true);
                return;
            }


        }


    }

    return (
        <>
            <div className='flex flex-col content-center h-screen'>
                <div className='flex justify-center m-5 gap-4'>
                    <Button variant='outline' component="a" href={"/hackathon/"}>
                        Back
                    </Button>
                    <Button variant='filled' component="a" onClick={() => toggleScanner()}>
                        Toggle scanner
                    </Button>
                    <TextInput hidden={qrOn} value={manualID}
                               onChange={(event) => setManualID(event.currentTarget.value)}/>
                    <Button hidden={qrOn} variant='filled' component="a" onClick={() => checkIn(manualID)}>
                        Submit Id
                    </Button>
                </div>
                <div className='flex justify-center p-10'>
                    {
                        data.success ?
                            <div>
                                <p className='text-2xl font-bold'>Make sure to ask them if this is correct!</p>
                                <div>Name: {data.displayName}</div>
                                <div>Dietary: {data.dietaryReq}</div>
                                <div>Extra: {data.extra}</div>
                                <div>Photo consent: {data.photoConsent ? 'Yes photos allowed' : 'No - double check they want this'}</div>
                            </div> :
                            <div>Error: {data.displayName}</div>
                    }
                </div>
                <div hidden={!qrOn} className={classes.qrReader}>

                    <video ref={videoEl}></video>
                    <div ref={qrBoxEl} className={classes.qrBox}>
                        <Image
                            src={QrFrame}
                            alt="Qr Frame"
                            width={256}
                            height={256}
                            className={classes.qrFrame}/>
                    </div>


                </div>
            </div>


        </>
    );
}

Qr.auth = true;
