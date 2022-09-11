import {useSession} from "next-auth/react";

export default function Teams() {
    const { data: session } = useSession()

    return (
    )
}

Teams.auth = true