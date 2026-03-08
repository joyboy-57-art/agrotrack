import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, IndianRupee, Tractor, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import bookingService from '../services/bookingService';
import Loader from '../components/Loader';
import agricultureImage from '../assets/images/agriculture.png';
import HeroBanner from '../components/HeroBanner';
import StatsCard from '../components/StatsCard';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getUserBookings(user.id);
                setBookings(data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user.id]);

    const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    const activeCount = bookings.filter(b => b.status === 'confirmed').length;
    const totalSpent = bookings.reduce((sum, b) => sum + Number(b.total_cost || 0), 0);

    if (loading) return <Loader fullPage />;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <HeroBanner
                title="Empowering Modern Agriculture"
                description="AgroTrack connects you with the best farming equipment. Seamlessly book, manage, and track your agricultural assets in one place."
                image={agricultureImage}
                actions={[
                    {
                        label: 'Browse Equipment',
                        onClick: () => navigate('/marketplace'),
                        primary: true,
                        icon: Tractor
                    },
                    {
                        label: 'My Bookings',
                        onClick: () => navigate('/my-bookings'),
                        icon: ArrowRight
                    }
                ]}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Total Bookings"
                    value={activeBookings.length}
                    icon={Package}
                    color="purple"
                    trend={{ value: 12, isUp: true }}
                />
                <StatsCard
                    title="Active Rentals"
                    value={activeCount}
                    icon={Clock}
                    color="blue"
                    trend={{ value: 8, isUp: true }}
                />
                <StatsCard
                    title="Total Spent"
                    value={`₹${totalSpent.toLocaleString()}`}
                    icon={IndianRupee}
                    color="agro"
                    trend={{ value: 5, isUp: false }}
                />
            </div>

            {/* Recent Activity / Next Steps can go here */}
            <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-8">
                <div className="card-premium p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 font-['Outfit']">Quick Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-agro-50 border border-agro-100 flex items-start">
                            <div className="p-2 bg-white rounded-xl mr-4 shadow-sm">
                                <ShieldCheck className="w-5 h-5 text-agro-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-agro-900 text-sm mb-1">Secure Transactions</h4>
                                <p className="text-xs text-agro-700 font-medium">All equipment rentals are backed by our secure payment and insurance system.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start">
                            <div className="p-2 bg-white rounded-xl mr-4 shadow-sm">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm mb-1">Timely Returns</h4>
                                <p className="text-xs text-blue-700 font-medium">Return equipment on time to maintain a perfect rating and unlock exclusive discounts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
