import Head from "next/head";
import {useSession} from "next-auth/react";
import {LoginButton} from "@/components/LoginButton";

export default function Home() {

    const { data: session } = useSession();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>ECSS Hackathon registration</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">

                <h1 className="font-bold text-6xl m-5">ECSS Hackathon registration</h1>
                
                <LoginButton />

            </main>
        </div>
    );
}