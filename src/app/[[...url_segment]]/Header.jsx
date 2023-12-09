"use client";

import Link from 'next/link'
import SignButton from '@/components/SignButton'

function Header() {
    return <div className="flex justify-between">
        <div className="flex flex-col justify-center">
            <h1 className="text-3xl align-middle">
                <Link href='/'>Root/</Link>
            </h1>
        </div>
        <div></div>
        <div><SignButton /></div>
    </div>
}

export default Header
