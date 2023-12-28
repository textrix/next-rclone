'use client'

import axios from "axios";
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import FormData from "form-data"

export default function UploadButton({ params: segment }) {

    const handleSubmit = async (event) => {
        event.preventDefault();
        const files = event.target.files.files;

        console.log(segment)
        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            const file = files[i]
            //const stream = file.stream()
            console.log(file)
            formData.append('file', file, file.name);

/*            // 파일을 분할하는 함수
            function* fileChunker(file) {
                let offset = 0;
                const chunkSize = 1024 * 1024; // 1MB 단위로 분할
                while (offset < file.size) {
                    const chunk = file.slice(offset, offset + chunkSize);
                    yield chunk;
                    offset += chunkSize;
                }
                console.log(offset)
            }
            // ReadableStream을 생성하여 Fetch API로 서버에 업로드
            const stream = new ReadableStream({
                start(controller) {
                    const reader = fileChunker(file);
                    function push() {
                        const { value, done } = reader.next();
                        if (done) {
                            controller.close();
                        } else {
                            controller.enqueue(value);
                            push();
                        }
                    }
                    push();
                }
            });
*/

            const onUploadProgress = (event) => {
                const percentage = Math.round((100 * event.loaded) / event.total);
                console.log(`${percentage}%`); // Or update progress bar
            }

            /*const response = await fetch('/api/upload', {
                method: 'POST',
                body: file.stream(),
                //duplex: 'half',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${encodeURI(file.name)}"`,
                    'fsremote': segment.join('/'),
                }
            })*/


            const fs = segment[0] + ':' // 01:
            const remote = segment.slice(1).join('/') // A/B/C
            const updir = encodeURIComponent(file.webkitRelativePath?.split('/').slice(0, -1).join('/'))
            const filename = `${encodeURIComponent(file.name)}`

            const response = await axios.post(
                `/api/upload`,
                formData,//file, //file.stream(),//file, //file.stream(),//stream,
                {
                    //responseType: 'stream',
                    headers: {
                        //'Content-Type': 'multipart/form-data; boundary="ZZZ"',
                        //'Content-Type': 'multipart/form-data',
                        //'Content-Disposition': `attachment; filename="${filename}" filename*=UTF-8''${filename}`,
                        //'Content-Transfer-Encoding': 'binary',
                        //'Content-Length': file.size.toString(),
                        //'filesize': file.size,
                        //'fsremote': segment.join('/'),
                        dstFs: fs,
                        dstRemote: `${remote}/${updir}`,
                        //'fs': fs,
                        //'remote': remote,
                        //...formData.getHeaders(),
                    },
                    onUploadProgress,
                }
            )
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" name="files" multiple webkitdirectory="true" />
            <button type="submit">Upload</button>
        </form>
    );
}

/*export default function UploadButton1({ params: segment }) {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        const files = event.target.files.files;

        console.log(segment)
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i].stream);
        }

        const response = await axios.post(
            '/api/upload',
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'fsremote': segment.join('/'),
                    //...formData.getHeaders(),
                },
                //onUploadProgress,
            }
        )
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" name="files" multiple webkitdirectory="true" />
            <button type="submit">Upload</button>
        </form>
    );
}
*/

/*

*/