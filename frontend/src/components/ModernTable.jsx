import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * ModernTable Component
 * @param {Array} columns - Array of { key, label, render, sortable }
 * @param {Array} data - Array of objects
 * @param {string} searchPlaceholder - Placeholder for search input
 * @param {string} title - Table title
 * @param {boolean} loading - Loading state
 */
const ModernTable = ({ columns, data, searchPlaceholder = "Search...", title, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        let sortableItems = [...(data || [])];
        if (searchTerm) {
            sortableItems = sortableItems.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig, searchTerm]);

    return (
        <div className="card-premium overflow-hidden bg-white animate-in fade-in duration-500">
            {/* Header */}
            <div className="p-6 lg:p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {title && (
                    <h3 className="text-xl font-black text-gray-900 font-['Outfit']">{title}</h3>
                )}

                <div className="relative group max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-agro-600 transition-colors" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border border-transparent rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:bg-white focus:border-agro-100 focus:ring-4 focus:ring-agro-50 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-gray-50/50">
                            {columns.map((col, idx) => (
                                <th
                                    key={col.key || idx}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    className={cn(
                                        "py-5 px-8 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase transition-colors",
                                        col.sortable && "cursor-pointer hover:text-agro-600 select-none",
                                        idx === 0 && "rounded-tl-2xl",
                                        idx === columns.length - 1 && "rounded-tr-2xl"
                                    )}
                                >
                                    <div className="flex items-center">
                                        {col.label}
                                        {col.sortable && sortConfig.key === col.key && (
                                            <span className="ml-2">
                                                {sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="py-5 px-8 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sortedData.map((item, rowIdx) => (
                            <tr key={item.id || rowIdx} className="hover:bg-agro-50/20 transition-colors group">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="py-5 px-8">
                                        {col.render ? col.render(item) : (
                                            <span className="text-sm font-bold text-gray-600">{item[col.key]}</span>
                                        )}
                                    </td>
                                ))}
                                <td className="py-5 px-8 text-right">
                                    <button className="p-2 text-gray-400 hover:text-agro-600 hover:bg-agro-50 rounded-xl transition-all">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {sortedData.length === 0 && !loading && (
                    <div className="py-20 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-3xl mx-auto flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-bold">No results found for "{searchTerm}"</p>
                    </div>
                )}

                {loading && (
                    <div className="py-20 text-center animate-pulse">
                        <p className="text-agro-600 font-bold tracking-widest uppercase text-xs">Loading records...</p>
                    </div>
                )}
            </div>

            {/* Footer / Pagination */}
            <div className="p-6 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Showing {sortedData.length} records
                </p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button className="px-4 py-2 text-xs font-bold text-white bg-agro-600 rounded-xl hover:bg-agro-700 shadow-lg shadow-agro-100">Next</button>
                </div>
            </div>
        </div>
    );
};

export default ModernTable;
