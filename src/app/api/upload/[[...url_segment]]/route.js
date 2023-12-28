import { NextRequest, NextResponse } from 'next/server'
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createWriteStream, mkdir } from 'fs'
import Busboy from 'busboy'
import * as rclone from '@/utils/rclone'

const pump = promisify(pipeline);

export async function POST(request) {
    const tmpDir = 'tmp/nrr';
    mkdir(`/${tmpDir}`, { recursive: true }, (err) => {
        if (err) throw err
    })

    const movePromises = []

    const busboy = Busboy({
        headers: Object.fromEntries(request.headers),
        defParamCharset: 'utf8',
    });

    busboy.on('file', (fieldname, file, { filename, encoding, mimeType }) => {
        const tmpFilename = `${Date.now().toString()}-${filename}`
        const wstream = createWriteStream(`/${tmpDir}/${tmpFilename}`)

        const filePromise = new Promise((resolve, reject) => {
            file.on('data', (data) => {
                wstream.write(data)
            }).on('close', async () => {
                wstream.end()

                const dstFs = request.headers.get('dstFs')
                const dstRemote = decodeURIComponent(request.headers.get('dstRemote'))
                //@@@ if dir upload & dir exist, reject

                const [res, err] = await rclone.direct_api('operations/movefile', {
                    srcFs: '/', srcRemote: `${tmpDir}/${tmpFilename}`,
                    dstFs: dstFs, dstRemote: `${dstRemote}/${filename}`,
                    _async: 'true',
                })
                resolve(res)
            })
        })

        movePromises.push(filePromise)
    })

    await pump(request.body, busboy)

    try {
        const results = await Promise.all(movePromises);
        return NextResponse.json(results, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
