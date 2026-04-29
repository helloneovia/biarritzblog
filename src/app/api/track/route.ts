import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UAParser } from "ua-parser-js"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { path } = body

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 })
        }

        const userAgentString = req.headers.get("user-agent") || ""
        const parser = new UAParser(userAgentString)
        const browser = parser.getBrowser().name || "Unknown"
        const os = parser.getOS().name || "Unknown"
        const deviceType = parser.getDevice().type || "Desktop"

        // Get country from Vercel headers if available
        const country = req.headers.get("x-vercel-ip-country") || "FR"

        await prisma.visit.create({
            data: {
                path,
                browser,
                os,
                device: deviceType,
                country
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("TRACKING_ERROR:", error)
        return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
    }
}
