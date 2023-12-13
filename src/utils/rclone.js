
import nextConfig from '@/../next.config';

async function api_(path, body, token = null) {
    let headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = 'Bearer ' + token
        console.log(headers)
    }

    try {
        const response = await fetch(path, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        })

        if (response.ok) {
            const result = await response.json()
            return [ result, null ]
        }

        const error_text = await response.text()
        return [ null, error_text || `HTTP error! status: ${response.status}` ]
    }
    catch (error) {
        return [ null, error.name + ': ' + error.message ]
    }
}

export async function api(path, body, token) {
    return await api_('/api/rclone/' + path, body, token)
}

export async function direct_api(path, body) {
    return await api_(process.env.RCD_URL + '/' + path, body)
}

export async function api_old(path, body) {
    const response = await fetch(process.env.NEXTAUTH_URL + '/api/rclone/' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return await response.json();
}

export async function direct_api_old(path, body) {
    const response = await fetch(process.env.RCD_URL + '/' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return await response.json();
}

export async function config_listremotes() {
    const response = await fetch(process.env.NEXTAUTH_URL+'/api/rclone/config/listremotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
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
