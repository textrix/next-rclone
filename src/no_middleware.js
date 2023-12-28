//export { default } from 'next-auth/middleware'

//import { isAuthenticated } from "@/utils/Auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


const protectedRoutes = ["/"];
const loginpath = ["/signin"]

export default function middleware(request) {
    if (request.nextUrl.pathname.startsWith('/api/upload')) {
        //console.log(request)
        console.log(request.url)
        console.log(request.nextUrl)
        const fs = request.headers.get('fs')
        const remote = request.headers.get('remote')
        console.log(fs, remote)
        //console.log(new URL(process.env.RCD_URL+`/operations/uploadfile`, request.url))
        //return NextResponse.rewrite(new URL(process.env.RCD_URL+`/operations/uploadfile${request.nextUrl.search}`, request.url))
    }

    //console.log(req.nextUrl.origin + req.nextUrl.pathname)
    /*    if (!isAuthenticated && !loginpath.includes(loginpath)) {
            const absoluteURL = new URL("/signin", req.nextUrl.origin);
            return NextResponse.redirect(absoluteURL.toString());
        }*/
    /*    
      if (!isAuthenticated) {//} && protectedRoutes.includes(req.nextUrl.pathname)) {
        const absoluteURL = new URL("/api/auth/signin", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
      }*/

}

