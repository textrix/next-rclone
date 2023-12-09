"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
import Link from 'next/link'
import * as rclone from '@/utils/rclone'
import SignButton from '@/components/SignButton'
import * as b2s from '@/utils/byte2string'

function FsAbout({params: fs}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            const [rep, err] = await rclone.api('operations/about', {fs: fs + ':'})

            if (err == null) {
                setData(rep)
                setError(null)
            }
            else {
                setError(err)
            }
        }

        const intervalID = setInterval(fetchData, 10000);

        fetchData()

        return () => clearInterval(intervalID)
    }, [])
  
    if (error) {
        return <div>error {error}</div>
    }

    if (!data) {
        return <div>loading...</div>
    }

    return (
        <li key={fs} className=''>
            <Link href={`/${fs}`}>&lt;{fs}&gt;<span> / </span>
                {b2s.byte2string(data.used)} /  
                {b2s.byte2string(data.free)} /  
                {b2s.byte2string(data.total)} / 
                {b2s.byte2string(data.trashed)}
           </Link>
        </li>
    )

    // logout icon https://fontawesome.com/icons/right-from-bracket?f=classic&s=solid
    return (
        <div>
            RROOOOTT
            <div className="flex justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl align-middle">
                        <Link href='/'>Root/</Link>
                    </h1>
                </div>
                <div></div>
                <div><SignButton /></div>
            </div>

            <ul>
                {data.map((item, index) => {
                    return (
                        <li key={index}><Link href={`/${item.remote}`}>&lt;{item.remote}&gt;<span> / </span>
                        <pre>{b2s.byte2string(item.about.used)} /  </pre>
                        <pre>{b2s.byte2string(item.about.free)} /  </pre>
                        <pre>{b2s.byte2string(item.about.total)} / </pre>
                        <pre>{b2s.byte2string(item.about.trashed)} </pre></Link></li>
                    )
                })}
            </ul>
        </div>
    );
}

export default FsAbout
