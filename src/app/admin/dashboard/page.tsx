import { Package, PlusCircle, Settings, Users, CreditCard } from "lucide-react"

export const metadata = {
    title: "Admin Dashboard - StepPrs",
}

export default function AdminDashboard() {
    // Dummy data representing orders from DB
    const recentOrders = [
        { id: "ORD-1042", customer: "Sarah M.", email: "sarah@example.com", status: "Paid & Unfulfilled", amount: "€59.00", date: "Today" },
        { id: "ORD-1041", customer: "David K.", email: "david.k@example.com", status: "Fulfilled", amount: "€39.00", date: "Yesterday" },
        { id: "ORD-1040", customer: "Emma L.", email: "emma.l@test.com", status: "Fulfilled", amount: "€75.00", date: "Yesterday" },
    ]

    const stats = [
        { name: "Total Revenue", value: "€12,540", change: "+14.5%", icon: CreditCard },
        { name: "Orders this week", value: "24", change: "+5.1%", icon: Package },
        { name: "Total Customers", value: "1,429", change: "+12.2%", icon: Users },
    ]

    return (
        <div className="flex bg-muted/20 min-h-[calc(100vh-64px)]">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-background hidden md:block px-4 py-8">
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Store Management</h2>
                    <nav className="space-y-2">
                        <a href="#" className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary text-sm font-medium">
                            <Package className="h-4 w-4" />
                            Orders
                        </a>
                        <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted text-sm font-medium">
                            <Users className="h-4 w-4" />
                            Customers
                        </a>
                        <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted text-sm font-medium">
                            <PlusCircle className="h-4 w-4" />
                            Products & Stock
                        </a>
                        <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted text-sm font-medium">
                            <Settings className="h-4 w-4" />
                            Settings
                        </a>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-background rounded-2xl border p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">{stat.name}</span>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="mt-4">
                                <span className="text-3xl font-bold">{stat.value}</span>
                                <span className="ml-2 text-sm text-green-600 font-medium">{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders Table */}
                <div className="bg-background rounded-2xl border overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Recent Orders</h2>
                        <button className="text-sm text-primary font-medium">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Order</th>
                                    <th className="px-6 py-3 font-medium">Customer</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentOrders.map((order, idx) => (
                                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-medium">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div>{order.customer}</div>
                                            <div className="text-xs text-muted-foreground">{order.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${order.status === 'Paid & Unfulfilled' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{order.amount}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
