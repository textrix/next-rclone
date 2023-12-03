import Image from 'next/image'
import { NextRequest, NextResponse } from 'next/server';
import Link from 'next/link';
import prettyBytes from 'pretty-bytes';
import nextConfig from '../../../next.config';

export default async function Home(req) {
  const level = Object.keys(req.params).length == 0 ? 0 : req.params.url_segment.length;

  if (0 == level) { // root
    const resp = await fetch(nextConfig.env.RCD_URL + '/config/listremotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const remote_list = await resp.json();

    let remote_about = [];

    try {
        const fetchPromises = remote_list.remotes.map(async item => {
          const url = nextConfig.env.RCD_URL + `/operations/about?fs=${item}:`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}'});
          if (!response.ok) {
            throw new Error("failed");
          }
          return response.json();
        });

        const results = await Promise.all(fetchPromises);

        remote_about = remote_list.remotes.map((remote, index) => {
          return { remote: remote, about: results[index] };
        });
      }
    catch (error) {
      console.log(error);
    }

    return (
      <div>
        <h1>Root</h1>

        <ul>
          {remote_about.map((item, index) => {
            return <li key={index}><Link href={`/${item.remote}`}>&lt;{item.remote}&gt;<span> / </span>
              {prettyBytes(item.about.free, { space:false, maximumFractionDigits: 2 })}<span> / </span>
              {prettyBytes(item.about.used, { space:false, maximumFractionDigits: 2 })}<span> / </span>
              {prettyBytes(item.about.total, { space:false, maximumFractionDigits: 2 })}<span> / </span>
              {prettyBytes(item.about.trashed, { space:false, maximumFractionDigits: 2 })}</Link></li>
          })}
        </ul>
      </div>
    );
  } else {
    const url_segment = req.params.url_segment.map(item => decodeURIComponent(item));
    const _fs = url_segment[0] + ':';
    const base_dir = url_segment[0];
    const full_dir = url_segment.join('/');
    const cur_dir = url_segment.slice(1).join('/');
    const up_dir = url_segment.slice(0, -1).join('/');

    const resp = await fetch(nextConfig.env.RCD_URL + '/operations/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fs: _fs, remote: cur_dir })
    });
    const dir_list = await resp.json();

    return (
      <div>
        <h1>
          {<span key='0'><Link href='/'>Root</Link> / </span>}
          {url_segment.map((item, index) => {
            const cur_link = url_segment.slice(0, index + 1).join('/') + ' ';
            if (url_segment.length - 1 != index) {
              return <span key={index}><Link href={'/' + cur_link}>{item}</Link> / </span>;
            } else {
              return <span key={index}>{item}</span>;
            }
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
}
