import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)

    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold mb-2">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account details and password.</p>
            </div>

            <div className="bg-card rounded-3xl border shadow-sm p-8 mt-8 space-y-8">
                <div>
                    <h3 className="text-lg font-bold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                disabled
                                value={user?.email || ""}
                                className="w-full px-4 py-3 rounded-xl border bg-muted/50 cursor-not-allowed outline-none"
                            />
                            <p className="text-xs text-muted-foreground mt-1.5">You cannot change your email address.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                defaultValue={user?.name || ""}
                                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <h3 className="text-lg font-bold mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">New Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <Button className="mt-6 rounded-xl font-bold">Update Settings</Button>
                </div>
            </div>
        </div>
    )
}
