import { NextRequest, NextResponse } from 'next/server'
import { pipeline } from 'stream/promises'
import fs from 'fs'
import Busboy from 'busboy'
import * as rclone from '@/utils/rclone'
import { tmpDir } from '@/utils/tmpdir'

export async function POST(request) {
    const movePromises = []

    const busboy = Busboy({
        headers: Object.fromEntries(request.headers),
        defParamCharset: 'utf8',
    })

    busboy.on('file', async (fieldname, file, { filename, encoding, mimeType }) => {
        const tmpFilename = `${Date.now().toString()}-${filename}`
        const wstream = fs.createWriteStream(`${tmpDir()}/${tmpFilename}`)

        movePromises.push(new Promise(async (resolve, reject) => {
            await pipeline(file, wstream)
            
            wstream.end(async () => {
                const dstFs = request.headers.get('dstFs')
                const dstRemote = decodeURIComponent(request.headers.get('dstRemote'))

                //@@@ if dir upload & dir exist, reject

                const [res, err] = await rclone.direct_api('operations/movefile', {
                    srcFs: { type: 'local', _root: tmpDir() }, srcRemote: tmpFilename,
                    dstFs: dstFs, dstRemote: `${dstRemote}/${filename}`,
                    _async: 'true',
                })

                if (err) {
                    reject(res)
                }
                else {
                    resolve(res)
                }
            })
        }))
    })

    await pipeline(request.body, busboy)

    try {
        const results = await Promise.all(movePromises)
        return NextResponse.json(results, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
