import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"
import path from "path"

export const maxDuration = 60;

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get("file") as File
        if (!file) return NextResponse.json({ error: "Aucun fichier uploadé" }, { status: 400 })

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Data = buffer.toString("base64")

        // Sanitize filename
        const ext = path.extname(file.name)
        const name = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "-")
        const filename = `${name}-${Date.now()}${ext}`

        // Determine MIME type
        const mimeMap: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
            ".gif": "image/gif",
            ".mp4": "video/mp4",
            ".webm": "video/webm",
        }
        const mimeType = mimeMap[ext.toLowerCase()] || file.type || "application/octet-stream"

        // Store in database instead of filesystem
        await prisma.upload.create({
            data: {
                filename,
                mimeType,
                data: base64Data,
            }
        })

        return NextResponse.json({ url: `/api/images/${filename}` })
    } catch (e: any) {
        console.error("Upload error:", e)
        return NextResponse.json({ error: "L'upload a échoué." }, { status: 500 })
    }
}
