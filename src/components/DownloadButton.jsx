'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function DownloadButton({ path }) {
    const { data: session, status, update } = useSession()

    const handleDownload = async () => {
        if (session && session.user && session.user.accessToken) {
            window.location.href = `${path}?token=${session.user.accessToken}`
        }
    }

    useEffect(() => {
    }, [session])

    return (
        <button onClick={handleDownload}>File Download</button>
    )
}
