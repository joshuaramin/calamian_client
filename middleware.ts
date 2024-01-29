import { NextRequest, NextResponse } from 'next/server'

export default function Middleware(req: NextRequest) {
    let cookies = req.cookies.get("pha-tkn");

    if (!cookies) {
        return NextResponse.redirect(new URL("/", req.url));
    }


}


export const config = {
    matcher: [ "/dashboard/:path*" ]
}