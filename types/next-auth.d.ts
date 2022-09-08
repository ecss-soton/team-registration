import {ISODateString} from "next-auth/core/types";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        firstName: string | null
        lastName: string | null
        discord: {
            tag: string | null
        }
        microsoft: {
            email: string | null
        }
        expires: ISODateString
        id: string;
    }

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User {
        firstName: string | null
        lastName: string | null
        displayName: string | null
        sotonId: string | null
        discordId: string | null
        discordTag: string | null
    }
    /**
     * Usually contains information about the provider being used
     * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
     */
    interface Account {}
    /** The OAuth profile returned from your provider */
    interface Profile {}
}