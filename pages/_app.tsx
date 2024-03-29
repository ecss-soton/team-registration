import "@/styles/globals.css";
import {AppProps} from "next/app";
import {SessionProvider, useSession} from "next-auth/react";
import {ColorScheme, ColorSchemeProvider, createEmotionCache, MantineProvider} from "@mantine/core";
import {NextComponentType, NextPageContext} from "next";
import Head from "next/head";
import {useLocalStorage} from "@mantine/hooks";

const myCache = createEmotionCache({key: 'mantine', prepend: false});

export default function MyApp({
                                  Component,
                                  pageProps: {session, ...pageProps}
                              }: AppProps & { Component: NextComponentType<NextPageContext, any, {}> & { auth: boolean } }) {

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue: 'dark',
        getInitialValueInEffect: true,
    });
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <SessionProvider session={session} basePath="/hackathon/api/auth">
            <Head>
                <title>ECSS Hackathon registration</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/hackathon/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/hackathon/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/hackathon/favicon-16x16.png"/>
                <link rel="icon" href="/hackathon/favicon.ico"/>
                <link rel="manifest" href="/hackathon/site.webmanifest"/>
            </Head>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    emotionCache={myCache}
                    theme={{
                        colorScheme: colorScheme,
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
            </ColorSchemeProvider>
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
