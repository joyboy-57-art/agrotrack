import React, { useState, useEffect } from 'react';
import {
    Tractor,
    Plus,
    Edit2,
    Trash2,
    Power,
    PowerOff,
    Search,
    Filter,
    ChevronRight,
    X,
    LayoutGrid,
    CheckCircle2,
    AlertCircle,
    Info,
    ArrowUpRight
} from 'lucide-react';
import equipmentService from '../../services/equipmentService';
import Loader from '../../components/Loader';
import { getEquipmentImage } from '../../assets/images';

const CATEGORIES = ['Tractor', 'Harvester', 'Plough', 'Seed Drill', 'Irrigation', 'Rotavator', 'Sprayer', 'Cultivator', 'Thresher'];

const EquipmentManagement = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Tractor',
        description: '',
        price_per_day: '',
        location: '',
        image_url: '',
        availability_status: 'Available'
    });

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        setLoading(true);
        try {
            const data = await equipmentService.getEquipment('');
            setEquipment(data);
        } catch (error) {
            console.error('Error fetching equipment:', error);
            alert('Failed to load equipment');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingEquipment(item);
            setFormData({
                name: item.name,
                category: item.category,
                description: item.description || '',
                price_per_day: item.price_per_day,
                location: item.location,
                image_url: item.image_url || '',
                availability_status: item.availability_status
            });
        } else {
            setEditingEquipment(null);
            setFormData({
                name: '',
                category: 'Tractor',
                description: '',
                price_per_day: '',
                location: '',
                image_url: '',
                availability_status: 'Available'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEquipment(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEquipment) {
                await equipmentService.updateEquipment(editingEquipment.id, formData);
            } else {
                await equipmentService.createEquipment(formData);
            }
            handleCloseModal();
            fetchEquipment();
        } catch (error) {
            console.error('Error saving equipment:', error);
            alert('Failed to save equipment');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this equipment?')) {
            try {
                await equipmentService.deleteEquipment(id);
                fetchEquipment();
            } catch (error) {
                console.error('Error deleting equipment:', error);
                alert('Failed to delete equipment');
            }
        }
    };

    const toggleStatus = async (item) => {
        const newStatus = item.availability_status === 'Available' ? 'Unavailable' : 'Available';
        try {
            await equipmentService.updateEquipment(item.id, { availability_status: newStatus });
            fetchEquipment();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update status');
        }
    };

    const filteredEquipment = equipment.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: equipment.length,
        available: equipment.filter(e => e.availability_status === 'Available').length,
        unavailable: equipment.filter(e => e.availability_status === 'Unavailable').length
    };

    if (loading && equipment.length === 0) return <Loader fullPage />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Tractor className="w-8 h-8 text-orange-600" /> Equipment Management
                    </h1>
                    <p className="text-gray-500 font-medium">Manage your fleet, pricing, and availability</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                >
                    <Plus className="w-5 h-5" /> Add New Equipment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <LayoutGrid className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Equipment</p>
                        <h4 className="text-3xl font-black text-gray-900">{stats.total}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Available</p>
                        <h4 className="text-3xl font-black text-gray-900">{stats.available}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                        <AlertCircle className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Unavailable</p>
                        <h4 className="text-3xl font-black text-gray-900">{stats.unavailable}</h4>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find equipment..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 font-medium placeholder:text-gray-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Equipment</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Price / Day</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredEquipment.length > 0 ? filteredEquipment.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                                <img
                                                    src={getEquipmentImage(item)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-400 font-medium">ID: #{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg truncate inline-block max-w-[120px]">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-gray-900 italic">
                                        ₹{item.price_per_day}
                                    </td>
                                    <td className="px-6 py-5 text-gray-500 font-medium">
                                        {item.location}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 ${item.availability_status === 'Available'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-red-50 text-red-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.availability_status === 'Available' ? 'bg-emerald-600' : 'bg-red-600'
                                                }`} />
                                            {item.availability_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleStatus(item)}
                                                title={item.availability_status === 'Available' ? 'Disable' : 'Enable'}
                                                className={`p-2 rounded-xl transition-colors ${item.availability_status === 'Available'
                                                        ? 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                                                        : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-500'
                                                    }`}
                                            >
                                                {item.availability_status === 'Available' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <Info className="w-10 h-10 opacity-20" />
                                            <p className="font-bold">No equipment found matching your search</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-center">
                    <p className="text-sm font-medium text-gray-400 flex items-center justify-center gap-1">
                        Showing {filteredEquipment.length} of {equipment.length} items <ArrowUpRight className="w-3 h-3" />
                    </p>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900">
                                {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
                            </h3>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Equipment Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 font-medium placeholder:text-gray-300"
                                        placeholder="e.g. John Deere 5050D"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 font-medium"
                                    >
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Price Per Day (₹)</label>
                                    <input
                                        type="number"
                                        name="price_per_day"
                                        required
                                        value={formData.price_per_day}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 font-medium placeholder:text-gray-300"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 font-medium placeholder:text-gray-300"
                                        placeholder="District, State"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Image URL</label>
                                    <input
                                        type="url"
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 font-medium placeholder:text-gray-300"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 font-medium placeholder:text-gray-300 resize-none"
                                        placeholder="Technical specs, features, etc."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Initial Status</label>
                                    <div className="flex gap-4 p-1 bg-gray-50 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, availability_status: 'Available' }))}
                                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${formData.availability_status === 'Available'
                                                    ? 'bg-white text-emerald-600 shadow-sm'
                                                    : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            Available
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, availability_status: 'Unavailable' }))}
                                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${formData.availability_status === 'Unavailable'
                                                    ? 'bg-white text-red-600 shadow-sm'
                                                    : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            Unavailable
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all uppercase tracking-widest text-xs shadow-lg shadow-gray-200"
                                >
                                    {editingEquipment ? 'Save Changes' : 'Create Equipment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentManagement;
