
import Link from 'next/link'
import * as rclone from '@/utils/rclone'
import * as b2s from '@/utils/byte2string'
import Header from './Header'
import DownloadButton from '@/components/DownloadButton'

export default async function IsNotRoot({ params: url_segment }) {
    const segment = url_segment.map(item => decodeURIComponent(item))
    const fs = segment[0] + ':' // 01:
    const full_dir = segment.join('/') // 01/A/B/C
    const remote_dir = segment.slice(1).join('/') // A/B/C
    const client_dir = `[${fs}]` + ((remote_dir) ? '/' + remote_dir : '') // 01:/A/B/C

    const [dir_list, error] = await rclone.direct_api('operations/list', {fs: fs, remote: remote_dir})
    const dir_style = { paddingRight: '0.5em' }

    return (
        <div>
            <Header params={segment} />

            <ul key='directory list'>
                {dir_list.list.filter(item => item.IsDir).map((item, index) => {
                    return <li key={index}>[<Link href={'/' + full_dir + '/' + item.Name}>{item.Name}/</Link>] {item.Size}</li>
                })}
            </ul>

            <ul key='file list'>
                {dir_list.list.filter(item => !item.IsDir).map((item, index) => {
                    return <li key={index}>
                        {b2s.byte2string(item.Size)} {item.Name}
                        <DownloadButton path={`${process.env.NEXTAUTH_URL}/api/download/${client_dir}/${item.Name}`} />
                        </li>
                })}
            </ul>
        </div>
    )
}

/*
                    return <li key={index}>
                        <a href={`${process.env.NEXTAUTH_URL}/api/download/${client_dir}/${item.Name}`}>
                        {b2s.byte2string(item.Size)} {item.Name}
                        </a> 
                        </li>
*/
