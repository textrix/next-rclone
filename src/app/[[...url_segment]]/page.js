import Image from 'next/image'
import { NextRequest, NextResponse } from 'next/server';
import Link from 'next/link';
import prettyBytes from 'pretty-bytes';
import * as rclone from '@/utils/rclone';

export default function CatchAll(req) {
    const { params } = req;
    const { url_segment } = params;
    const level = (!url_segment || params.length == 0) ? 0 : params.length;

    return (0 == level) ? is_root() : is_not_root(url_segment);
}

async function is_root() {
    const remote_list = await rclone.config_listremotes();

    let remote_about = [];

    const fetchPromises = remote_list.remotes.map(async item => {
        return await rclone.op_about(item);
    });
    const results = await Promise.all(fetchPromises);

    remote_about = remote_list.remotes.map((remote, index) => {
        return { remote: remote, about: results[index] };
    });

    return (
        <div>
            <h1>Root/</h1>

            <ul>
                {remote_about.map((item, index) => {
                    return <li key={index}><Link href={`/${item.remote}`}>&lt;{item.remote}&gt;<span> / </span>
                        {prettyBytes(item.about.free, { space: false, maximumFractionDigits: 2 })}<span> / </span>
                        {prettyBytes(item.about.used, { space: false, maximumFractionDigits: 2 })}<span> / </span>
                        {prettyBytes(item.about.total, { space: false, maximumFractionDigits: 2 })}<span> / </span>
                        {prettyBytes(item.about.trashed, { space: false, maximumFractionDigits: 2 })}</Link></li>
                })}
            </ul>
        </div>
    );
}

async function is_not_root(url_segment) {
    const segment = url_segment.map(item => decodeURIComponent(item));
    const fs = segment[0] + ':';
    const base_dir = segment[0];
    const full_dir = segment.join('/');
    const cur_dir = segment.slice(1).join('/');
    const up_dir = segment.slice(0, -1).join('/');

    const dir_list = await rclone.op_list(fs, cur_dir);
    const dir_style = {paddingRight: '0.5em'};

    return (
        <div>
            <h1>
                {<span key='0' style={dir_style}><Link href='/'>Root/</Link></span>}
                {segment.map((item, index) => {
                    const cur_link = segment.slice(0, index + 1).join('/') + ' ';
                    //const slash = segment.length - 1 != index ? '/' : '';
                    const slash = 0 != index ? '/' : ':';
                    return <span key={index+1} style={dir_style}><Link href={'/' + cur_link}>{item}{slash}</Link></span>;
                })}
            </h1>

            <ul key='directory list'>
                {dir_list.list.filter(item => item.IsDir).map((item, index) => {
                    return <li key={index}>[<Link href={'/' + full_dir + '/' + item.Name}>{item.Name}/</Link>]</li>
                })}
            </ul>

            <ul key='file list'>
                {dir_list.list.filter(item => !item.IsDir).map((item, index) => {
                    return <li key={index}>{prettyBytes(item.Size, { maximumFractionDigits: 2 })} {item.Name}</li>
                })}
            </ul>
        </div>
    );
}
