import { NextRequest, NextResponse } from 'next/server'
import { pipeline } from 'stream/promises'
import fs from 'fs'
import Busboy from 'busboy'
import * as rclone from '@/utils/rclone'
import { tmpDir } from '@/utils/tmpdir'

// Define an asynchronous POST function
export async function POST(request) {
    // Initialize an array to hold promises for moving files
    const movePromises = []

    // Create a new Busboy object with the request headers
    const busboy = Busboy({
        headers: Object.fromEntries(request.headers),
        defParamCharset: 'utf8',
    })

    // When a file is detected in the upload, this function will be called
    busboy.on('file', async (fieldname, file, { filename, encoding, mimeType }) => {
        // Create a temporary filename
        const tmpFilename = `${Date.now().toString()}-${filename}`
        // Create a write stream for the temporary file
        const wstream = fs.createWriteStream(`${tmpDir()}/${tmpFilename}`)

        // Push a new promise to the movePromises array
        movePromises.push(new Promise(async (resolve, reject) => {
            // Pipe the file to the write stream
            await pipeline(file, wstream)
            
            // When the write stream ends, this function will be called
            wstream.end(async () => {
                // Get the destination filesystem and remote from the request headers
                const dstFs = request.headers.get('dstFs')
                const dstRemote = decodeURIComponent(request.headers.get('dstRemote'))

                //TODO If directory upload & directory exists, reject/overwrite/rename
                //TODO SharePoint issue: https://github.com/rclone/rclone/issues/6075
                //     Move to recycle.bin?: https://rclone.org/onedrive/#replacing-deleting-existing-files-on-sharepoint-gets-item-not-found

                // Call the rclone API to move the file
                const [res, err] = await rclone.direct_api('operations/movefile', {
                    srcFs: { type: 'local', _root: tmpDir() }, srcRemote: tmpFilename,
                    dstFs: dstFs, dstRemote: `${dstRemote}/${filename}`,
                    _async: 'true',
                })

                // If there's an error, reject the promise with the response
                if (err) {
                    reject(res)
                }
                // Otherwise, resolve the promise with the response
                else {
                    resolve(res)
                }
            })
        }))
    })

    // Pipe the request body to Busboy
    await pipeline(request.body, busboy)

    try {
        const results = await Promise.all(movePromises)
        return NextResponse.json(results, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
