import Image from 'next/image'
import { NextRequest, NextResponse } from 'next/server';
import Link from 'next/link';
import prettyBytes from 'pretty-bytes';

export default async function Home(req) {
  console.log(JSON.stringify(req));
  console.log(req);

  const level = Object.keys(req.params).length == 0 ? 0 : req.params.url_segment.length;
  console.log(level);

  if (0 == level) { // root
    const resp = await fetch(process.env.RCD_URL+'/config/listremotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const remote_list = await resp.json();

    return (
      <div>
        <h1>Catch-All Route at Root</h1>
        <p>Path Parameters: {JSON.stringify(remote_list)}</p>

        <ul>
          {remote_list.remotes.map((item, index) => {
            return <li key={index}><Link href={`/${item}`}>{item}</Link></li>
          })}
        </ul>
      </div>
    );
  } else {
    const url_segment = req.params.url_segment;
    const _fs = url_segment[0]+':';
    const base_dir = url_segment[0];
    const full_dir = decodeURIComponent(url_segment.join('/'));
    const cur_dir = decodeURIComponent(url_segment.slice(1).join('/'));
    const up_dir = decodeURIComponent(url_segment.slice(0,-1).join('/'));

    const resp = await fetch(process.env.RCD_URL+'/operations/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({fs: _fs, remote: cur_dir})
    });
    const dir_list = await resp.json();
    //console.log(dir_list);
    console.log(full_dir);
    console.log(cur_dir);
    console.log(up_dir);

    return (
      <div>
        <h1>Dir: {full_dir}</h1>

        <ul>
          <li><Link href={'/'+up_dir}>Up</Link></li>
        </ul>

        <ul>
          {dir_list.list.map((item) => {
            if (item.IsDir) {
              return <li>[<Link href={'/'+full_dir+'/'+item.Name}>{item.Name}/</Link>]</li>
            }
          })}
        </ul>

        <ul>
          {dir_list.list.map((item) => {
            if (!item.IsDir) {
              return <li>{prettyBytes(item.Size,{minimumFractionDigits: 0})} {item.Name}</li>
            }
          })}
        </ul>
      </div>
    );
  }
}
