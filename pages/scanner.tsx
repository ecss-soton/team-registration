import {TeamCard} from '@/components/TeamCard';
import {Button, Card, Checkbox} from '@mantine/core';
import React, {useState} from 'react';
import {Team} from '@/types/types';
import useSWR from 'swr';
import fetcher from '../middleware/fetch';
import Link from "next/link";
import QRCode from "react-qr-code";
import {useSession} from "next-auth/react";

export default function Qr() {

    const [data, setData] = useState('unknown user');
    const [showScanner, setShowScanner] = useState(false);

    return (
        <>
            <div>
                <Link href="/" passHref>
                    <Button variant='outline' component="a">
                        Back
                    </Button>
                </Link>
                {/*<Button variant='filled' component="a" onClick={() => setShowScanner(true)}>*/}
                {/*    Scan*/}
                {/*</Button>*/}
                {/*{data}*/}
                {/*{showScanner && <QrReader // https://www.npmjs.com/package/react-qr-reader*/}
                {/*    onResult={(result, error) => {*/}
                {/*        if (!!result) {*/}
                {/*            setData(result.getText());*/}
                {/*            setShowScanner(false)*/}
                {/*        }*/}

                {/*        if (!!error) {*/}
                {/*            console.info(error);*/}
                {/*        }*/}
                {/*    }}*/}
                {/*    className='w-4/5'*/}
                {/*    constraints={{ facingMode: 'environment' }}*/}
                {/*/>}*/}
            </div>


        </>
    );
}

Qr.auth = true;