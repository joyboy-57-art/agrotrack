import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, ChevronDown, CheckSquare, Square } from 'lucide-react';
import equipmentService from '../services/equipmentService';
import EquipmentCard from '../components/EquipmentCard';
import Loader from '../components/Loader';
import { IMAGES } from '../assets/images';

const CATEGORIES = ['Tractors', 'Harvesters', 'Plough', 'Seed Drill', 'Irrigation', 'Rotavator', 'Sprayer', 'Cultivator', 'Thresher'];
const PRICE_RANGES = [
    { id: 'all', label: 'All Prices' },
    { id: 'low', label: 'Under ₹1,000/day', min: 0, max: 999 },
    { id: 'mid', label: '₹1,000 - ₹2,500/day', min: 1000, max: 2500 },
    { id: 'high', label: 'Above ₹2,500/day', min: 2501, max: 99999 }
];

const EquipmentList = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters State
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedCategories, setSelectedCategories] = useState(
        searchParams.get('cat') ? [searchParams.get('cat')] : []
    );
    const [priceRange, setPriceRange] = useState('all');
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    // Mobile filter toggle
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        setLoading(true);
        try {
            const data = await equipmentService.getEquipment('');
            setEquipment(data);
        } catch (err) {
            console.error('Error fetching equipment:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (cat) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
        setPriceRange('all');
        setOnlyAvailable(false);
        setSearchParams({});
    };

    // Derived State
    const filteredEquipment = equipment.filter(item => {
        // Search Match
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Category Match
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);

        // Price Match
        const price = Number(item.price_per_day);
        let matchesPrice = true;
        if (priceRange !== 'all') {
            const range = PRICE_RANGES.find(r => r.id === priceRange);
            matchesPrice = price >= range.min && price <= range.max;
        }

        // Availability Match
        const matchesAvailability = !onlyAvailable || item.availability_status === 'Available';

        return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* ═══════════════════════════════════════════════════════
                HEADER (Slightly more compact for SaaS feel)
            ═══════════════════════════════════════════════════════ */}
            <div className="bg-emerald-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Equipment Marketplace</h1>
                        <p className="text-emerald-200 text-lg">Browse {equipment.length} verified machines ready for your farm.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-white border border-gray-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-gray-700 shadow-sm"
                    >
                        <Filter className="w-5 h-5" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* ═══════════════════════════════════════════════════════
                        SIDEBAR FILTERS
                    ═══════════════════════════════════════════════════════ */}
                    <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block shrink-0`}>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5 text-emerald-600" /> Filters
                                </h2>
                                {(searchQuery || selectedCategories.length > 0 || priceRange !== 'all' || onlyAvailable) && (
                                    <button onClick={clearFilters} className="text-sm font-semibold text-gray-500 hover:text-emerald-600">
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Equipment Type */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Equipment Type</h3>
                                <div className="space-y-3">
                                    {CATEGORIES.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat)}
                                                    onChange={() => toggleCategory(cat)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-colors flex items-center justify-center">
                                                    <CheckSquare className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 absolute shrink-0" />
                                                </div>
                                            </div>
                                            <span className="text-gray-600 font-medium group-hover:text-gray-900">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
                                <div className="space-y-3">
                                    {PRICE_RANGES.map(range => (
                                        <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                checked={priceRange === range.id}
                                                onChange={() => setPriceRange(range.id)}
                                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                            />
                                            <span className="text-gray-600 font-medium group-hover:text-gray-900">{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Availability</h3>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={onlyAvailable}
                                            onChange={() => setOnlyAvailable(!onlyAvailable)}
                                            className="peer sr-only"
                                        />
                                        <div className={`w-10 h-6 rounded-full transition-colors ${onlyAvailable ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${onlyAvailable ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                    <span className="text-gray-600 font-medium group-hover:text-gray-900">Show Only Available</span>
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        MAIN CONTENT (Search Bar & Grid)
                    ═══════════════════════════════════════════════════════ */}
                    <div className="flex-1">

                        {/* Top Search Bar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 flex items-center relative z-20">
                            <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by name or category (e.g., Tractor, Harvester)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none focus:outline-none py-3 px-4 text-gray-800 font-medium placeholder:text-gray-400"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-2 text-gray-400 hover:text-gray-600 mr-2">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Top Stats Bar */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-500 font-medium">
                                Showing <span className="font-bold text-gray-900">{filteredEquipment.length}</span> results
                            </p>
                        </div>

                        {/* Equipment Grid */}
                        {loading ? (
                            <Loader />
                        ) : filteredEquipment.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                                {filteredEquipment.map((item) => (
                                    <div className="h-full" key={item.id}>
                                        <EquipmentCard equipment={item} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 border-dashed">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No equipment found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                                    We couldn't find anything matching your filters. Try adjusting your search criteria.
                                </p>
                                <button onClick={clearFilters} className="bg-emerald-50 text-emerald-700 font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors">
                                    Clear All Filters
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentList;
