import { prisma } from "@/lib/prisma"
import { PaymentsClient } from "./PaymentsClient"

export const dynamic = "force-dynamic"

export default async function PaymentsPage() {
    const config = await prisma.siteConfig.findUnique({
        where: { id: "global" }
    })

    return <PaymentsClient initialConfig={config} />
}
