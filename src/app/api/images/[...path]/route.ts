import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathParts } = await params
    const filePath = path.join(process.cwd(), "public", "uploads", ...pathParts)

    if (!existsSync(filePath)) {
        return new NextResponse("Not found", { status: 404 })
    }

    try {
        const file = await readFile(filePath)
        const ext = path.extname(filePath).toLowerCase()
        const mimeMap: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
            ".gif": "image/gif",
            ".mp4": "video/mp4",
            ".webm": "video/webm",
        }
        const contentType = mimeMap[ext] || "application/octet-stream"
        return new NextResponse(file, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        })
    } catch {
        return new NextResponse("Error reading file", { status: 500 })
    }
}
