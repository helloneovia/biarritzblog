import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathParts } = await params
    const filename = pathParts.join("/")

    try {
        // Look up the file in the database
        const upload = await prisma.upload.findUnique({
            where: { filename }
        })

        if (!upload) {
            return new NextResponse("Not found", { status: 404 })
        }

        // Decode the base64 data back to a buffer
        const buffer = Buffer.from(upload.data, "base64")

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": upload.mimeType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "Content-Length": String(buffer.length),
            },
        })
    } catch (error) {
        console.error("Image serve error:", error)
        return new NextResponse("Error serving file", { status: 500 })
    }
}
