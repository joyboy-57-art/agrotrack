import React from 'react';
import { Users } from 'lucide-react';

const UsersManagement = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-gray-100 mt-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 flex items-center">
                            <Users className="w-6 h-6 mr-3 text-blue-600" /> Users Management
                        </h3>
                        <p className="text-gray-400 text-sm font-medium">Manage farmer accounts and roles</p>
                    </div>
                </div>
                <div className="py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Users className="w-10 h-10 mb-4 opacity-50" />
                    <p className="font-semibold text-gray-500">User management module coming soon</p>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;
