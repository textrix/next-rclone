import Link from 'next/link'
import Header from './Header'
import * as rclone from '@/utils/rclone'
import * as b2s from '@/utils/byte2string'

export default async function IsRoot() {
    const [remote_list, error] = await rclone.direct_api('config/listremotes', {})
    if (error) {
        return <div>{error}</div>
    }

    return (
        <div>
            <Header />
            {
                remote_list?.remotes.map(async (fs) => {
                    const [about, error] = await rclone.direct_api('operations/about', { fs: fs + ':' })
                    if (error) {
                        return <div>{error}</div>
                    }
                    return (
                        <li key={fs} className=''>
                            <Link href={`/${fs}`}>{`<${fs}> `}
                                {b2s.byte2string(about.used)} /
                                {b2s.byte2string(about.free)} /
                                {b2s.byte2string(about.total)} /
                                {b2s.byte2string(about.trashed)}
                            </Link>
                        </li>
                    )
                })
            }
        </div>
    )
}
