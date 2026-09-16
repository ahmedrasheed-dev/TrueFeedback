'use client'

import { signIn, useSession } from "next-auth/react"

export default function Component() {
    const { data: session, status } = useSession();

    return (
        <>
            <h1>Signed in As {session?.user?.email}</h1>
            <button onClick={() => signIn()}>Sign In</button>
        </>
    );
}