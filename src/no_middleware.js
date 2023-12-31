//export { default } from 'next-auth/middleware'

import { NextResponse } from "next/server";
import * as jwt from '@/utils/jwt'
import { log } from "console";

const protectedRoutes = ["/api/:path*"];
const loginpath = ["/login", "/signin", "/api/auth/signin", "/api/auth/callback"]

export default function middleware(request) {
    //if (request.nextUrl.pathname.startsWith('/api/rclone')) {
    //if (request.nextUrl.pathname.startsWith('/api/rclone')) {
    if (!loginpath.includes(request.nextUrl.pathname)) {
        const status = jwt.verifyAuth(request.headers)
        if (200 != status) {
            const errmsg = (403 == status) ? 'Forbidden' : (401 == status) ? 'No Authorization' : 'Unknown Error'
            return NextResponse.json({ error: errmsg }, { status: status })
        }
    }

    return NextResponse.next()

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

