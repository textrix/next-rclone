import { NextRequest, NextResponse } from 'next/server'
import * as rclone from '@/utils/rclone'
import { verifyJwt } from '@/utils/jwt'

export async function POST(request, { params }) {
    const auth_value = request.headers.get('Authorization')
    const status = verifyToken(auth_value)

    if (200 != status) {
        return NextResponse.json({ error: 'No Authorization' }, {status: status})
    }
    const { url_segment } = params
    const api_path = url_segment.join('/')
    const body = await request.json()
    const [res, err] = await rclone.direct_api(api_path, body)

    return NextResponse.json(res)
}

function verifyToken(auth_value) {
    if (auth_value) {
        // When called externally: Checks the pre-issued API token with the value passed as 'Bearer'
        if (auth_value.startsWith('Bearer ')) {
            if (auth_value.replace('Bearer ', '') == process.env.API_TOKEN) {
                return 200
            }
            else {
                return 403 // Fobidden
            }
        }
        // When called from a client component: Resolves to accessToken combined with session
        else if (verifyJwt(auth_value)) {
            return 200
        }
        else {
            return 403
        }
    }
    return 401
}
