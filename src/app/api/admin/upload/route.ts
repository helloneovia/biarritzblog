import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

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

        // Sanitize filename to avoid weird chars
        const ext = path.extname(file.name)
        const name = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "-")
        const filename = `${name}-${Date.now()}${ext}`

        const uploadDir = path.join(process.cwd(), "public", "uploads")
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)

        return NextResponse.json({ url: `/api/images/${filename}` })
    } catch (e: any) {
        console.error("Upload error:", e)
        return NextResponse.json({ error: "L'upload a échoué." }, { status: 500 })
    }
}
