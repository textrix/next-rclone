'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import Link from 'next/link'
import * as rclone from '@/utils/rclone'
import * as b2s from '@/utils/byte2string'

export default function FsAbout({ params: fs }) {
    const { data: session, status, update } = useSession()
    const [ about, setAbout ] = useState(null);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (session && session.user && session.user.accessToken) {
                const [rep, err] = await rclone.api('operations/about', { fs: fs + ':' }, session.user.accessToken)

                if (err == null) {
                    setAbout(rep)
                    setError(null)
                }
                else {
                    setError(err)
                }
            }
            else {
                setAbout(null)
                setError(null)
            }
        }

        const intervalID = setInterval(fetchData, 10000);
        fetchData()
        return () => clearInterval(intervalID)
    }, [session])

    if (error) {
        return <div>error {error}</div>
    }

    if (!about) {
        return <div>{fs}: loading...</div>
    }

    return (
        <li key={fs} className=''>
            <Link href={`/${fs}`}>&lt;{fs}&gt;<span> / </span>
                {b2s.byte2string(about.used)} /
                {b2s.byte2string(about.free)} /
                {b2s.byte2string(about.total)} /
                {b2s.byte2string(about.trashed)}
            </Link>
        </li>
    )
}
