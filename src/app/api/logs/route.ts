import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
    return NextResponse.json({ logs: (global as any).__WEBHOOK_LOGS__ || [] });
}
