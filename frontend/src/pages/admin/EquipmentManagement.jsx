import React, { useState, useEffect } from 'react';
import { Tractor, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import ModernTable from '../../components/ModernTable';
import api from '../../services/api';
import { cn } from '../../lib/utils';

const EquipmentManagement = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price_per_day: '',
        location: '',
        description: '',
        image_url: ''
    });

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/equipment?isAdmin=true');
            setEquipment(data);
        } catch (err) {
            console.error('Error fetching equipment:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this equipment?")) return;
        try {
            await api.delete(`/equipment/${id}`);
            fetchEquipment();
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await api.put(`/equipment/${editingId}`, formData);
            } else {
                await api.post('/equipment', formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchEquipment();
        } catch (err) {
            console.error('Failed to save', err);
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Equipment Name',
            sortable: true,
            render: (item) => (
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 mr-4 flex items-center justify-center text-orange-600 font-bold border border-orange-100">
                        {item.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-900">{item.name}</span>
                </div>
            )
        },
        { key: 'category', label: 'Category', sortable: true },
        {
            key: 'price_per_day',
            label: 'Daily Rate',
            sortable: true,
            render: (item) => <span className="font-black text-gray-900">₹{item.price_per_day}</span>
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item) => (
                <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold",
                    item.availability_status === 'available' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                    {item.availability_status === 'available' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {item.availability_status}
                </span>
            )
        },
        {
            key: 'actions',
            label: '',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => {
                            setEditingId(item.id);
                            setFormData({
                                name: item.name,
                                category: item.category,
                                price_per_day: item.price_per_day,
                                location: item.location,
                                description: item.description,
                                image_url: item.image_url || ''
                            });
                            setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-agro-600 hover:bg-agro-50 rounded-xl transition-colors"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Equipment Fleet</h2>
                    <p className="text-gray-500 font-medium">Manage and monitor all agricultural assets.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', category: '', price_per_day: '', location: '', description: '', image_url: '' });
                        setIsModalOpen(true);
                    }}
                    className="bg-agro-600 hover:bg-agro-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-agro-100 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Equipment
                </button>
            </div>

            <ModernTable
                title="Active Inventory"
                columns={columns}
                data={equipment}
                loading={loading}
                searchPlaceholder="Search by name, category, or owner..."
            />

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>

                        <h3 className="text-2xl font-black text-gray-900 mb-8 italic font-['Outfit']">
                            {editingId ? 'Edit Equipment' : 'Add New Equipment'}
                        </h3>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-premium w-full bg-gray-50 border-gray-100 px-4" placeholder="Tractor John Deere" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Category</label>
                                    <input type="text" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="input-premium w-full bg-gray-50 border-gray-100 px-4" placeholder="Tractor / Harvester" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Daily Rate (₹)</label>
                                    <input type="number" required value={formData.price_per_day} onChange={e => setFormData({ ...formData, price_per_day: e.target.value })} className="input-premium w-full bg-gray-50 border-gray-100 px-4" placeholder="1500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Location</label>
                                    <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="input-premium w-full bg-gray-50 border-gray-100 px-4" placeholder="Pune, MH" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Image URL</label>
                                    <input type="text" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="input-premium w-full bg-gray-50 border-gray-100 px-4" placeholder="https://..." />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Description</label>
                                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-premium w-full bg-gray-50 border-gray-100 px-4 py-3 resize-none" placeholder="Provide equipment details..."></textarea>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-end gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost px-6 py-3">Discard</button>
                                <button type="submit" disabled={saving} className="btn-primary px-8 py-3">
                                    {saving ? 'Processing...' : (editingId ? 'Update Asset' : 'Deploy Asset')}
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
