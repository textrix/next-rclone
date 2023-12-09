import Image from 'next/image'
import { NextRequest, NextResponse } from 'next/server'
import Link from 'next/link'
import * as rclone from '@/utils/rclone'
import * as b2s from '@/utils/byte2string'
import SignButton from '@/components/SignButton'
import Header from './Header'
import FsAbout from './FsAbout'

export default function CatchAll(context) {
    const { params } = context
    const { url_segment } = params
    const level = (!url_segment || params.length == 0) ? 0 : params.length

    return (0 == level) ? is_root() : is_not_root(url_segment)
}

async function is_root() {
    const [remote_list, error] = await rclone.direct_api('config/listremotes', {})
    
    return (
        <div>
        <Header />
        {remote_list.remotes.map((item) => {
            return (<FsAbout params={item} />)
        })}
        </div>
    )
}

async function is_not_root(url_segment) {
    const segment = url_segment.map(item => decodeURIComponent(item))
    const fs = segment[0] + ':'
    const base_dir = segment[0];
    const full_dir = segment.join('/')
    const cur_dir = segment.slice(1).join('/')
    const up_dir = segment.slice(0, -1).join('/')

    const [dir_list, error] = await rclone.direct_api('operations/list', {fs: fs, remote: cur_dir})
    const dir_style = { paddingRight: '0.5em' }

    return (
        <div>
            <div className="flex justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl align-middle">
                        {<span key='0' style={dir_style}><Link href='/'>Root/</Link></span>}
                        {segment.map((item, index) => {
                            const cur_link = segment.slice(0, index + 1).join('/') + ' ';
                            //const slash = segment.length - 1 != index ? '/' : '';
                            const slash = 0 != index ? '/' : ':';
                            return <span key={index + 1} style={dir_style}><Link href={'/' + cur_link}>{item}{slash}</Link></span>;
                        })}
                    </h1>
                </div>
                <div></div>
                <div><SignButton /></div>
            </div>

            <ul key='directory list'>
                {dir_list.list.filter(item => item.IsDir).map((item, index) => {
                    return <li key={index}>[<Link href={'/' + full_dir + '/' + item.Name}>{item.Name}/</Link>]</li>
                })}
            </ul>

            <ul key='file list'>
                {dir_list.list.filter(item => !item.IsDir).map((item, index) => {
                    return <li key={index}>{b2s.byte2string(item.Size)} {item.Name}</li>
                })}
            </ul>
        </div>
    );
}
