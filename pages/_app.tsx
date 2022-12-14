import "@/styles/globals.css";
import {AppProps} from "next/app";
import {SessionProvider, useSession} from "next-auth/react";
import {createEmotionCache, MantineProvider} from "@mantine/core";
import {NextComponentType, NextPageContext} from "next";

const myCache = createEmotionCache({key: 'mantine', prepend: false});

export default function MyApp({
        Component,
        pageProps: {session, ...pageProps}
    }: AppProps & { Component: NextComponentType<NextPageContext, any, {}> & { auth: boolean } }) {
    return (
        <SessionProvider session={session}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                emotionCache={myCache}
                theme={{
                    colorScheme: "light",
                    colors: {
                        brand: ['#dbf9ff', '#afe8ff', '#80d8ff', '#51c8fe', '#2cb8fc', '#1c9fe3', '#0d7bb2', '#005880', '#00354f', '#00131f'],
                    },
                    primaryColor: 'brand',
                }}
            >
                {Component.auth ? (
                    <Auth>
                        <Component {...pageProps} />
                    </Auth>
                ) : (
                    <Component {...pageProps} />
                )}
            </MantineProvider>
        </SessionProvider>
    );
}

function Auth({children}: { children: any }) {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const {status} = useSession({required: true})

    if (status === "loading") { // TODO add a proper loading screen
        return <div>Loading...</div>
    }

    return children
}