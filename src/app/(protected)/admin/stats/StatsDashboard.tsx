"use client"

import { formatCurrency } from "@/lib/utils"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    BarChart, Bar
} from "recharts"
import { TrendingUp, Users, CreditCard, LayoutDashboard } from "lucide-react"

// Color Palette for Pie Charts
const COLORS = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6', '#ef4444', '#14b8a6']

export default function StatsDashboard({ data }: { data: any }) {

    const {
        totalRevenue,
        totalOrders,
        revenueOverTime,
        salesByCountry,
        salesByDevice,
        salesByBrowser,
        topProducts
    } = data

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border shadow-lg rounded-xl p-3 text-sm">
                    <p className="font-bold text-gray-700">{label}</p>
                    <p className="text-indigo-600 font-semibold mt-1">
                        {payload[0].name}: {payload[0].name === "revenue" || payload[0].name === "revenu" ? formatCurrency(payload[0].value) : payload[0].value}
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                        <CreditCard className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Chiffre d'Affaires</p>
                        <p className="text-3xl font-black">{formatCurrency(totalRevenue)}</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                        <LayoutDashboard className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Commandes</p>
                        <p className="text-3xl font-black">{totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                        <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Panier Moyen</p>
                        <p className="text-3xl font-black">{formatCurrency(avgOrderValue)}</p>
                    </div>
                </div>
            </div>

            {/* Line Chart: Revenue Over Time */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="text-lg font-bold mb-6">Évolution du Chiffre d'Affaires</h3>
                <div className="h-80 w-full">
                    {revenueOverTime.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="revenue" name="revenu" stroke="#4f46e5" strokeWidth={4} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">Pas assez de données.</div>
                    )}
                </div>
            </div>

            {/* Pie Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Device Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold mb-4">Répartition par Appareil</h3>
                    <div className="h-64 w-full flex-1">
                        {salesByDevice.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={salesByDevice} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {salesByDevice.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Pas de données.</div>
                        )}
                    </div>
                </div>

                {/* Browser Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold mb-4">Répartition par Navigateur</h3>
                    <div className="h-64 w-full flex-1">
                        {salesByBrowser.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={salesByBrowser} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {salesByBrowser.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Pas de données.</div>
                        )}
                    </div>
                </div>

                {/* Country Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold mb-4">Répartition par Pays</h3>
                    <div className="h-64 w-full flex-1">
                        {salesByCountry.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={salesByCountry} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {salesByCountry.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Pas de données.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Products Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="text-lg font-bold mb-6">Top Produits & Bundles (Chiffre d'Affaires)</h3>
                <div className="h-80 w-full">
                    {topProducts.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#ec4899" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="revenu" name="Revenu (€)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                                <Bar yAxisId="right" dataKey="ventes" name="Unités vendues" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">Pas assez de données.</div>
                    )}
                </div>
            </div>

        </div>
    )
}
