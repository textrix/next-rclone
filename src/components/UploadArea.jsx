'use client'

import axios from "axios";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import FormData from "form-data"

export default function UploadArea({ params: segment }) {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const traverseFileTree = (item, path = '')  => {
        if (item.isFile) {
            item.file((file) => {
                file.fullPath = `${path}/${file.name}`
                setUploadedFiles((files) => [...files, file])
                //console.log(uploadedFiles)
                //uploadedFiles.push(file)
            })
        } else if (item.isDirectory) {
            const dir = item.fullPath.replace(/^\//, ''); // Remove the first '/' if it exists
            const dirReader = item.createReader();
            dirReader.readEntries((entries) => {
                entries.forEach((entry) => {
                    traverseFileTree(entry, dir)
                })
            })
        }
    }

    useEffect(() => {
        console.log(uploadedFiles)
        if (uploadedFiles.length == 0) return

        Array.from(uploadedFiles).forEach(async (file) => {
            const formData = new FormData();
            formData.append('file', file, file.name);

            const onUploadProgress = (event) => {
                const percentage = Math.round((100 * event.loaded) / event.total);
                console.log(`${percentage}%`); // Or update progress bar
            }

            const fs = segment[0] + ':' // 01:
            const remote = segment.slice(1).join('/') // A/B/C
            const updir = encodeURIComponent(file.fullPath?.split('/').slice(0, -1).join('/'))
            const filename = `${encodeURIComponent(file.name)}`

            console.log(remote, updir)
            const response = await axios.post(
                `/api/upload`,
                formData,
                {
                    headers: {
                        dstFs: fs,
                        dstRemote: `${remote}/${updir}`,
                    },
                    onUploadProgress,
                }
            )    
        })

        setUploadedFiles([])
    }, [uploadedFiles])

    const handleDrop = async (event) => {
        event.preventDefault();

        const items = event.dataTransfer.items;
        Array.from(items).forEach((item) => {
            const entry = item.webkitGetAsEntry()
            if (entry) {
                traverseFileTree(entry)
            }
        })
    }

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ width: '100%', height: '200px', border: '1px dashed gray' }}
        >
            <p>Drag and drop files here</p>
            {uploadedFiles.map((file, index) => (
                <div key={index}>{file.fullPath}</div>
            ))}
        </div>
    )
}
