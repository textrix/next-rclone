export { default } from 'next-auth/middleware'

import { isAuthenticated } from "@/utils/Auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


const protectedRoutes = ["/"];
const loginpath = ["/signin"]

/*export default*/ function middleware_no(req) {
    console.log(req.nextUrl.origin + req.nextUrl.pathname)
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

