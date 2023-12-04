import nextConfig from '@/../next.config';

export async function config_listremotes() {
    const response = await fetch(nextConfig.env.RCD_URL + '/config/listremotes', {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
       // body: '{}'
    });
    const remote_list = await response.json();
    return remote_list;
}

export async function op_about(fs) {
    const url = nextConfig.env.RCD_URL + `/operations/about?fs=${fs}:`;
    const response = await fetch(url, {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        //body: '{}'
    });
    //if (!response.ok) {
    //    throw new Error("failed");
    //}
    return await response.json();
}

export async function op_list(fs, remote) {
    const url = nextConfig.env.RCD_URL + `/operations/list?fs=${fs}&remote=${remote}`;
    const response = await fetch(url, {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        //body: '{}',//JSON.stringify({ fs: fs, remote: remote })
    });
    const dir_list = await response.json();
    return dir_list;
}
