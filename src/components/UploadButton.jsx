'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function UploadButton({ path }) {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        const files = event.target.files.files;
        console.log(files)
    
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
    
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
    
        const result = await response.json();
        console.log(result);
      };
    
      return (
        <form onSubmit={handleSubmit}>
          <input type="file" name="files" multiple webkitdirectory="true" />
          <button type="submit">Upload</button>
        </form>
      );

    const handleFilesUpload = async (event) => {
        const files = event.target.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        console.log(formData)

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('파일 업로드 성공');
        } else {
            console.error('파일 업로드 실패');
        }
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFilesUpload} />
            <input type="file" webkitdirectory="" directory="" onChange={handleFilesUpload} />
        </div>
    );
}

/*

*/