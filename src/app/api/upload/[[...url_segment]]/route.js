import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import axios from 'axios'
import { lookup } from 'mime-types'
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request) {
    const formData = await request.formData();
    const files = formData.get('files');
    console.log(files)

    
    const formDataEntryValues = Array.from(formData.values());
    console.log("form data", formData, formDataEntryValues);
    console.log(formDataEntryValues[0])

    /*if (!file) {
        return NextResponse.json({ success: false })
      }*/
    

    /*const form = formidable({});

    form.parse(request, (err, fields, files) => {
        if (err) {
            return NextResponse.json({ error: "There was an error parsing the files" }, { status: 500 });
        }
        // 'files' 객체 안에 업로드된 파일 정보가 있습니다.
        console.log(files);
        return NextResponse.json({ message: 'Files uploaded successfully', files }, { status: 200 });
    });*/

    return NextResponse.json({ message: 'ok' }, { status: 200 });
}

