import { NextRequest, NextResponse } from 'next/server'
import * as rclone from '@/utils/rclone'
import * as jwt from '@/utils/jwt'

export async function POST(request, { params }) {
    const auth_value = request.headers.get('Authorization')
    const status = jwt.verifyToken(auth_value)

    if (200 != status) {
        return NextResponse.json({ error: 'No Authorization' }, {status: status})
    }

    const { url_segment } = params
    const api_path = url_segment.join('/')
    const body = await request.json()
    const [res, err] = await rclone.direct_api(api_path, body)

    return NextResponse.json(res)
}
