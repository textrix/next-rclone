import { NextRequest } from 'next/server'
import * as rclone from '@/utils/rclone'
import { verifyJwt } from '@/utils/jwt'

export async function POST(request, {params}) {
    const accessToken = request.headers.get('authorization')
    //console.log(accessToken)
    if (!accessToken || !verifyJwt(accessToken.split(' ')[1])) {
        return new Response(JSON.stringify({ error: 'No Authorization' }), {
            status: 401,
          })
    }
    const {url_segment} = params;
    const api_path = url_segment.join('/') 
    const body = await request.json()
    const [res, err] = await rclone.direct_api(api_path, body)

    return Response.json(res)
}
