import { NextRequest, NextResponse } from 'next/server'
//import { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'
import { verifyToken } from '@/utils/jwt'
import axios from 'axios'
import { lookup } from 'mime-types'
import { pipeline } from 'stream';
import { promisify } from 'util';
import { Readable } from 'stream';
import httpProxyMiddleware from "next-http-proxy-middleware";
//import streamifier from "streamifier";
import formidable from 'formidable'
//import { Busboy } from 'busboy'
const Busboy = require('busboy');

import * as rclone from '@/utils/rclone'

// https://codersteps.com/articles/building-a-file-uploader-from-scratch-with-next-js-app-directory
// https://nodejs.org/en/guides/backpressuring-in-streams

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

const pump = promisify(pipeline);


export async function POST1(request) {
    const contentDisposition = request.headers.get('content-disposition')
    const filename = contentDisposition.match(/filename="(.+)"/)[1]
    const filesize = request.headers.get('filesize')
    console.log(filename, filesize)

    console.log(request.headers.get('fsremote'))
    const segment = request.headers.get('fsremote').split('/')
    const fs = segment[0]
    const remote = segment.slice(1).join('/')

    return httpProxyMiddleware(request, NextApiResponse, {
        target: `${process.env.RCD_URL}/operations/uploadfile?fs=${fs}:&remote=${remote}/${filename}`
    })

    return NextResponse.json({ message: 'ok' }, { status: 200 });
}

import { createWriteStream } from 'fs'
import { RocknRoll_One } from 'next/font/google'
//import { NextRequest, NextResponse } from 'next/server'
const bodyToStream = require('fetch-request-body-to-stream')
const Stream = require('stream');

export async function POST(request) {

    console.log('ppp--------')

    const onUploadProgress = (event) => {
        const percentage = Math.round((100 * event.loaded) / event.total);
        console.log(`${percentage}%`); // Or update progress bar
    };

    const newUrl = new URL(process.env.RCD_URL+`/operations/uploadfile${request.nextUrl.search}`, request.url)
    //console.log(newUrl)

    const dstFs = request.headers.get('dstFs')
    const dstRemote = decodeURIComponent(request.headers.get('dstRemote'))

    const bb = Busboy({
        headers: Object.fromEntries(request.headers),
        defParamCharset: 'utf8',
        //fileHwm: 10*1024*1024,
        //highWaterMark: 10*1024*1024,
        //preservePath: true
    });

    bb.on('file', (fieldname, file, {filename, encoding, mimeType}) => {
        console.log(`File [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimeType}`);
        //const patchedStream = new Stream.PassThrough({highWaterMark: 10*1024*1024});
        const wstream = createWriteStream(`/tmp/${filename}`)
        console.log(request.headers)

        file.on('data', (data) => {
            //console.log(`File [${fieldname}] got ${data.length} bytes`);
            wstream.write(data)
        }).on('end', async () => {
            wstream.end()
            console.log(`File [${fieldname}] Finished`);
            await rclone.direct_api('operations/movefile', {
                srcFs: '/', srcRemote: `tmp/${filename}`,
                dstFs: dstFs, dstRemote: `${dstRemote}/${filename}`,
                _async: 'true',
            })
        });
    });

    bb.on('field', (fieldname, val, {nameTruncated, valueTruncated, encoding, mimeType}) => {
        console.log(`Field [${fieldname}]: value: ${val}`);
    });

    bb.on('finish', () => {
        console.log('Form data parsing complete');
        return NextResponse.json({ status: "success" })
    });

    await pump(request.body, bb)
    // request.body.pipe(busboy);


    //await pump(request.body, wstream)

    //console.log(request.headers)

    return NextResponse.json({ status: "success" })

    /*
    const onUploadProgress = (event) => {
        const percentage = Math.round((100 * event.loaded) / event.total);
        console.log(`${percentage}%`); // Or update progress bar
    };

    const newUrl = new URL(process.env.RCD_URL+`/operations/uploadfile${request.nextUrl.search}`, request.url)
    console.log(newUrl)

    const patchedStream = new Stream.PassThrough({highWaterMark: 10*1024*1024});

    //const send_response = await
    axios.post(
        newUrl,
        patchedStream,//request.body,
        {
            headers: Object.fromEntries(request.headers),
            //request.headers,
            onUploadProgress,
        }
    )

    await pump(request.body, patchedStream)

    //console.log(request.headers)

    return NextResponse.json({ status: "success" })
*/
    const busboy = Busboy({
        headers: Object.fromEntries(request.headers),
        defParamCharset: 'utf8',
        fileHwm: 10*1024*1024,
        highWaterMark: 10*1024*1024,
    });

    busboy.on('file', (fieldname, file, {filename, encoding, mimeType}) => {
        console.log(`File [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimeType}`);

        file.on('data', (data) => {
            console.log(`File [${fieldname}] got ${data.length} bytes`);
        }).on('end', () => {
            console.log(`File [${fieldname}] Finished`);
        });
    });

    busboy.on('field', (fieldname, val, {nameTruncated, valueTruncated, encoding, mimeType}) => {
        console.log(`Field [${fieldname}]: value: ${val}`);
    });

    busboy.on('finish', () => {
        console.log('Form data parsing complete');
        return NextResponse.json({ status: "success" })

    });

    await pump(request.body, busboy)
    // request.body.pipe(busboy);

    return NextResponse.json({ status: "failed" })

    return new Promise((resolve) => {
        const busboy = new Busboy({ headers: request.headers });
        console.log(JSON.stringify(request.headers, null, 2));
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log(
                'File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype,
            );
            file.on('data', function (data) {
                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });
            file.on('end', function () {
                console.log('File [' + fieldname + '] Finished');
            });
        });
        busboy.on('field', function (fieldname, val) {
            console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        });
        busboy.on('finish', function () {
            console.log('Done parsing form!');

            resolve(1);
        });
        req.pipe(busboy);
    });
}

/*export*/ async function POSTdsfdaf(request) {
    const contentType = request.headers.get('content-type');
    console.log(contentType)
    const boundary = contentType.split('; ')[1].split('=')[1];

    const filePath = `/tmp/test.txt`
    await pump(request.body, createWriteStream(filePath, { highWaterMark: 1024 * 1024 }))
    return NextResponse.json({ status: "success" })

    const parts = [];
    let buffer = [];

    request.on('data', (chunk) => {
        buffer.push(...chunk);

        let boundaryIndex = buffer.indexOf(`--${boundary}`);
        while (boundaryIndex !== -1) {
            const part = buffer.slice(0, boundaryIndex);
            buffer = buffer.slice(boundaryIndex + boundary.length + 2);
            parts.push(part);
            boundaryIndex = buffer.indexOf(`--${boundary}`);
        }
    });

    request.on('end', () => {
        // Handle parts here
        parts.forEach((part) => {
            // Process each part
            // Note: This is a very basic example and does not handle file uploads or binary data.
            const partData = Buffer.from(part).toString();
            console.log(partData);
        });


    });


    try {
        console.log('post--------------')
        const formData = await request.formData();
        //const file = formData.getAll('files')[0]
        const file = formData.get('file')
        const filePath = `/tmp/${file.name}`
        console.log(file.name, file.size)
        //await pump(file.stream(), createWriteStream(filePath, {highWaterMark: 1024*1024}))
        console.log(file.name, file.size)
        const reader = stream.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            //handleChunk( value );
            console.log(value.byteLength)
        }
        return NextResponse.json({ status: "success", data: file.size })
    }
    catch (e) {
        return NextResponse.json({ status: "fail", data: e })
    }
}

async function abab(request) {
    const data = await request.formData()
    const file = data.get('file')

    console.log(data)

    if (!file) {
        return NextResponse.json({ success: false })
    }

    const path = `/tmp/${file.name}`
    const writeStream = createWriteStream(path);

    // 스트리밍을 이용한 파일 쓰기
    const fileStream = file.stream();
    const fdata = new FormData()
    fdata.append('file', file)
    request.body.pipe(writeStream);

    fileStream.on('end', () => {
        console.log(`open ${path} to see the uploaded file`);
    });

    return new Promise((resolve, reject) => {
        fileStream.on('error', (error) => {
            reject(NextResponse.json({ success: false, error: error.message }));
        });

        writeStream.on('finish', () => {
            resolve(NextResponse.json({ success: true }));
        });
    });
}

/*export*/ async function POST2(request) {
    //const formData = await request.formData();
    const file = formData.get('file');
    console.log(file)

    //const stream = file.stream()
    const contentDisposition = request.headers.get('content-disposition')
    const filename = contentDisposition.match(/filename="(.+)"/)[1]
    const filesize = request.headers.get('filesize')
    console.log(filename, filesize)

    console.log(request.headers.get('fsremote'))
    const segment = request.headers.get('fsremote').split('/')
    const fs = segment[0]
    const remote = segment.slice(1).join('/')

    //const data = new FormData()
    //data.append("file", stream)

    const onUploadProgress = (event) => {
        const percentage = Math.round((100 * event.loaded) / event.total);
        console.log(`${percentage}%`); // Or update progress bar
    };

    //const data = new FormData()
    //data.append("file", file)

    //const readable = new Readable();

    /*request.body.pipe(readable);
  
    readable.on('data', chunk => {
        //data += chunk;
      });
  
      readable.on('end', () => {
        // 데이터 처리 완료
        //console.log(data); // 받은 데이터 출력
        //res.status(200).json({ message: 'Data received successfully' });
      });
  
      readable.on('error', (err) => {
        console.error(err);
        //res.status(500).json({ error: 'Error processing stream' });
      });*/

    const stream = fs.createReadStream(path);
    const formData = new FormData();
    formData.append('file', stream, { filepath: path, filename: basename(path) });


    const send_response = await axios.post(
        `${process.env.RCD_URL}/operations/uploadfile?fs=${fs}:&remote=${remote}/${filename}`,
        //data, //file.stream(),//request,//file.stream(),//passThroughStream, //request,
        formData,//buffer,//fdata,//Readable.from(buffer),///fdata,//Readable.from(await request.blob()),
        {
            //responseType: 'stream',
            headers: {
                //'Content-Type': file.mimetype,
                //'Content-Length': filesize,
                //'Content-Type': 'multipart/form-data',
                //'Content-Type': 'application/octet-stream',
                'Content-Type': 'multipart/form-data;boundary=None',
                //...fdata.getHeaders(),
            },
            onUploadProgress,
        }
    )

    //data.pipe(NextResponse)

    //await promisify(pipeline)(request, axiosStream.data);

    return NextResponse.json({ message: 'ok' }, { status: 200 });
}

/*export async function POST1(request) {
    const formData = await request.formData();
    const files = formData.getAll('files');

    console.log(request.headers.get('fsremote'))
    const segment = request.headers.get('fsremote').split('/')
    const fs = segment[0]
    const remote = segment.slice(1).join('/')

    files.map(async (file) => {
        console.log(file.name, file.size)
        const data = new FormData()
        data.append("file", file)

        const onUploadProgress = (event) => {
            const percentage = Math.round((100 * event.loaded) / event.total);
            console.log(`${percentage}%`); // Or update progress bar
        };

        const response = await axios.post(
            `${process.env.RCD_URL}/operations/uploadfile?fs=${fs}:&remote=${remote}/${file.name}`,
            data,
            {
                headers: {
                    'Content-Type': file.mimetype,
                    'Content-Length': file.size,
                    'Content-Type': 'multipart/form-data',
                    //...file.getHeaders(),
                },
                onUploadProgress,
            }
        )
        //return NextResponse.json({ message: 'Files uploaded successfully', file }, { status: 200 });
    })

    return NextResponse.json({ message: 'ok' }, { status: 200 });
}
*/