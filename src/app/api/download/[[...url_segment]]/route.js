import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import axios from 'axios'
import { lookup } from 'mime-types'

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const status = verifyToken(token)

    if (200 != status) {
        return NextResponse.json({ error: 'No Authorization' }, { status: status })
    }

    // Extract the filename array (from the catch-all route)
    const { url_segment } = params

    // Combine the array into a single string to create an external URL
    const externalUrl = encodeURI(`${process.env.RCD_URL}/${url_segment.join('/')}`)
    const filename = url_segment.slice(-1)
    //const binFilename = Buffer.from(filename).toString('binary')

    try {
        // Use axios to make a streaming request.
        const response = await axios({
            method: 'get',
            url: externalUrl,
            responseType: 'stream'
        })

        // Pass the streamed data to the Response object.
        const headers = {
            'Content-Length': response.headers['content-length'],
            'Content-Type': lookup(externalUrl) || 'application/octet-stream',
            'Content-Disposition': `attachment;  filename*=utf-8''${encodeURIComponent(filename)}`
        }

        return new Response(response.data, {
            headers: headers,
            status: 200
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error }, { status: 400 })
    }
}
