import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Mail, Calendar, ShieldCheck } from 'lucide-react';
import ModernTable from '../../components/ModernTable';
import api from '../../services/api';
import { cn } from '../../lib/utils';
import { formatDate } from '../../utils/formatDate';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/admin/users');
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const columns = [
        {
            key: 'name',
            label: 'User Details',
            sortable: true,
            render: (item) => (
                <div className="flex items-center">
                    <div className={cn(
                        "w-10 h-10 rounded-xl mr-4 flex items-center justify-center font-bold border",
                        item.role === 'admin' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"
                    )}>
                        {item.role === 'admin' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight">{item.name}</span>
                        <span className="text-xs text-gray-400 font-medium">{item.email}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (item) => (
                <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    item.role === 'admin' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                )}>
                    {item.role}
                </span>
            )
        },
        { key: 'mobile_number', label: 'Contact', sortable: false },
        {
            key: 'created_at',
            label: 'Joined Date',
            sortable: true,
            render: (item) => (
                <div className="flex items-center text-gray-500 font-medium text-sm">
                    <Calendar className="w-4 h-4 mr-2 opacity-50" />
                    {formatDate(item.created_at)}
                </div>
            )
        }
    ];

    return (
        <div className="animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Community Management</h2>
                    <p className="text-gray-500 font-medium">Monitor user activity and permission levels.</p>
                </div>
            </div>

            <ModernTable
                title="Active Accounts"
                columns={columns}
                data={users}
                loading={loading}
                searchPlaceholder="Search by name, email, or role..."
            />
        </div>
    );
};

export default UsersManagement;
