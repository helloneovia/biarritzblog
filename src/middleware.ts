import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SUPPORTED_LOCALES = ["EN", "FR", "ES"]
const DEFAULT_LOCALE = "EN"

export function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Read locale from cookie
    const locale = request.cookies.get("NEXT_LOCALE")?.value
    const effectiveLocale = SUPPORTED_LOCALES.includes(locale || "") ? locale! : DEFAULT_LOCALE

    // Add locale to request headers so server components can read it
    response.headers.set("x-locale", effectiveLocale)

    return response
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
