import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line } from 'recharts';
import { LayoutDashboard, Users, Package, ShoppingCart, IndianRupee, TrendingUp, Cpu, Tractor, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const res = await fetch("http://localhost:5000/api/admin/analytics", {
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`
                    }
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                setAnalytics(data);
            } catch (error) {
                console.error("Analytics API error:", error);
                setError("Failed to load analytics data.");
            }
        };

        fetchAnalytics();
    }, []);

    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
    if (!analytics) return <div className="p-10 text-center font-bold">Loading analytics...</div>;

    const { totalUsers, totalEquipment, totalBookings, totalRevenue, availableEquipment, unavailableEquipment, monthlyData, equipmentList } = analytics;

    const topCards = [
        { label: 'Total Users', value: totalUsers, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Users className="w-6 h-6" /> },
        { label: 'Total Equipment', value: totalEquipment, color: 'text-blue-600', bg: 'bg-blue-50', icon: <Tractor className="w-6 h-6" /> },
        { label: 'Total Bookings', value: totalBookings, color: 'text-purple-600', bg: 'bg-purple-50', icon: <ShoppingCart className="w-6 h-6" /> },
        { label: 'Total Revenue', value: `₹${totalRevenue}`, color: 'text-agro-600', bg: 'bg-agro-50', icon: <IndianRupee className="w-6 h-6" /> },
        { label: 'Available Equipment', value: availableEquipment, color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle className="w-6 h-6" /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
                        <LayoutDashboard className="w-10 h-10 mr-4 text-agro-600" /> Admin Analytics
                    </h1>
                    <p className="text-gray-500 font-medium">Monitor system health and rental performance</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                {topCards.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-agro-100 border border-gray-50 group hover:-translate-y-1 transition-all duration-300">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                            {stat.icon}
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
                        <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <h2 className="text-2xl font-black text-gray-900 mb-6 mt-12">Revenue Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                {/* Monthly Revenue Line Chart */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 flex items-center">
                                <TrendingUp className="w-6 h-6 mr-3 text-agro-600" /> Monthly Revenue
                            </h3>
                            <p className="text-gray-400 text-sm font-medium">Revenue trends over the last year</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-15} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                                    formatter={(value) => [`₹${value}`, 'Revenue']}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={4} dot={{ strokeWidth: 2, r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Bookings Bar Chart */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 flex items-center">
                                <ShoppingCart className="w-6 h-6 mr-3 text-purple-600" /> Bookings Per Month
                            </h3>
                            <p className="text-gray-400 text-sm font-medium">Number of completed bookings</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-15} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [value, 'Bookings']}
                                />
                                <Bar dataKey="bookings" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Equipment Monitoring Section */}
            <h2 className="text-2xl font-black text-gray-900 mb-6 mt-12">Equipment Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total</p>
                        <p className="text-3xl font-black text-gray-900">{analytics.totalEquipment}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                        <Tractor className="w-6 h-6 text-gray-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-green-600 text-sm font-bold uppercase tracking-wider mb-1">Available</p>
                        <p className="text-3xl font-black text-green-700">{analytics.availableEquipment}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-red-600 text-sm font-bold uppercase tracking-wider mb-1">Unavailable</p>
                        <p className="text-3xl font-black text-red-700">{analytics.unavailableEquipment}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Equipment Status Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-gray-900">Equipment Status Overview</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase">Equipment Name</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase">Category</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase">Owner</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase">Availability Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {equipmentList.map((eq) => (
                                <tr key={eq.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-gray-900">{eq.name}</td>
                                    <td className="py-4 px-6 text-gray-500">{eq.category}</td>
                                    <td className="py-4 px-6 text-gray-500">{eq.owner || 'Admin'}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${eq.availabilityStatus === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {eq.availabilityStatus === 'Available' ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : <XCircle className="w-3.5 h-3.5 mr-1" />}
                                            {eq.availabilityStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {equipmentList.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">No equipment found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
