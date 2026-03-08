import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import {
    Users,
    ShoppingCart,
    IndianRupee,
    TrendingUp,
    Tractor,
    CheckCircle,
    XCircle,
    LayoutDashboard,
    Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import Loader from '../components/Loader';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get("/admin/analytics");
                setAnalytics(res.data);
            } catch (error) {
                console.error("Analytics API error:", error);
                setError("Failed to load analytics data.");
            }
        };

        fetchAnalytics();
    }, []);

    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
    if (!user || !analytics) return <Loader fullPage />;

    const { totalUsers, totalEquipment, totalBookings, totalRevenue, availableEquipment, unavailableEquipment, monthlyData, equipmentList } = analytics;

    return (
        <div className="animate-in fade-in duration-700">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Overview</h2>
                <p className="text-gray-500 font-medium">Real-time performance metrics and equipment health.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={IndianRupee}
                    color="agro"
                    trend={{ value: 15, isUp: true }}
                />
                <StatsCard
                    title="Active Bookings"
                    value={totalBookings}
                    icon={ShoppingCart}
                    color="purple"
                    trend={{ value: 5, isUp: true }}
                />
                <StatsCard
                    title="Total Users"
                    value={totalUsers}
                    icon={Users}
                    color="blue"
                    trend={{ value: 12, isUp: true }}
                />
                <StatsCard
                    title="Available Gear"
                    value={availableEquipment}
                    icon={Tractor}
                    color="orange"
                />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Monthly Revenue Line Chart */}
                <div className="card-premium p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center font-['Outfit']">
                                <TrendingUp className="w-5 h-5 mr-3 text-agro-600" /> Revenue Growth
                            </h3>
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1">Monthly performance</p>
                        </div>
                        <div className="bg-agro-50 text-agro-600 px-3 py-1 rounded-full text-xs font-bold">
                            +15.4%
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                                    formatter={(value) => [`₹${value}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Bookings Bar Chart */}
                <div className="card-premium p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center font-['Outfit']">
                                <Activity className="w-5 h-5 mr-3 text-purple-600" /> Rental Activity
                            </h3>
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1">Bookings volume</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dx={-10} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [value, 'Bookings']}
                                />
                                <Bar dataKey="bookings" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Equipment Status Table */}
            <div className="card-premium overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 font-['Outfit']">Equipment Inventory</h3>
                        <p className="text-sm text-gray-400 font-medium">Monitoring status and ownership</p>
                    </div>
                    <button className="text-sm font-bold text-agro-600 hover:text-agro-700 transition-colors">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="py-5 px-8 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Machine Name</th>
                                <th className="py-5 px-8 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Category</th>
                                <th className="py-5 px-8 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Owner</th>
                                <th className="py-5 px-8 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {equipmentList.slice(0, 5).map((eq) => (
                                <tr key={eq.id} className="hover:bg-agro-50/30 transition-colors group">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 mr-4 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-agro-600 transition-colors">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-900">{eq.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <span className="text-sm font-medium text-gray-500">{eq.category}</span>
                                    </td>
                                    <td className="py-5 px-8 text-sm font-medium text-gray-500">{eq.owner || 'System'}</td>
                                    <td className="py-5 px-8 text-right">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold ${eq.availabilityStatus === 'available'
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-red-50 text-red-600'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${eq.availabilityStatus === 'available' ? 'bg-green-500' : 'bg-red-500'
                                                }`}></div>
                                            <span className="capitalize">{eq.availabilityStatus}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
