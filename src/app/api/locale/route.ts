import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { locale } = await req.json()
    const supported = ["EN", "FR", "ES"]
    if (!supported.includes(locale)) {
        return NextResponse.json({ error: "Locale non supportée" }, { status: 400 })
    }

    const response = NextResponse.json({ ok: true, locale })
    response.cookies.set("NEXT_LOCALE", locale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        sameSite: "lax",
    })
    return response
}
