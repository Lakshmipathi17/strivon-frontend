import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, User, Phone, Dumbbell, X } from 'lucide-react';
const API = import.meta.env.VITE_API_BASE_URL;
interface Client {
    id: number;
    name: string;
    userName: string;
    phoneNumber: string;
    height: number;
    weight: number;
    workoutfrequency: number;
    gender: string;
    age: number;
}

export default function ClientsList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [editFormData, setEditFormData] = useState<Client | null>(null);

    useEffect( () => {
        const fetchClients = async () => {
            try{
                const response = await fetch(`${API}/trainer/client-details`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if( !response.ok){
                    alert("token expired.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('Trainer');
                    localStorage.removeItem('clients');
                    window.location.href = '/';
                }
                const clientsData = await response.json();
                localStorage.setItem('clients', JSON.stringify(clientsData));
                setClients(clientsData);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        }
        fetchClients();
    }, []);
            
    const handleEditClick = (client: Client) => {
        setEditingClient(client);
        setEditFormData({ ...client });
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editFormData) return;  
        const { name, value } = e.target;
        setEditFormData((prev) => ({
            ...prev!,
            [name]: value,
        }));
    };

    const handleSaveEdit = () => {
        if (!editFormData) return;
        
        if (!editFormData.name || !editFormData.phoneNumber || !editFormData.userName || !editFormData.height || !editFormData.weight || !editFormData.gender || !editFormData.age) {
            alert('Please fill all fields');
            return;
        }

        const updatedClients = clients.map((client) =>
            client.id === editFormData.id ? editFormData : client
        );
        setClients(updatedClients);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        const updateClient = async ()=>{
            try{
                await fetch(`${API}/trainer/client-details/edit/${editFormData.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(editFormData)
                });
            } catch (error) {
                console.error('Error updating client:', error);
            }
        }
        updateClient();
        setEditingClient(null);
        setEditFormData(null);
    };

    const handleCancelEdit = () => {
        setEditingClient(null);
        setEditFormData(null);
    };

    const handleDeleteClient = (id: number) => {
        if (confirm('Are you sure you want to delete this client?')) {
            const updatedClients = clients.filter((client) => client.id !== id);
            setClients(updatedClients);
            localStorage.setItem('clients', JSON.stringify(updatedClients));
            const handleDelete = async ()=>{
                try{
                    await fetch(`${API}/trainer/client-details/delete/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                    });
                } catch (error) {
                    console.error('Error deleting client:', error);
                }
            }
            handleDelete();
        }
    };

    const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const calculateBMI = (height: number, weight: number) => {
        if (!height || !weight) return 'N/A';
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        return bmi;
    };

    return (
        <div className="min-h-screen bg-dark pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">My Clients</h1>
                            <p className="text-gray-400">Manage and track your clients' fitness journey</p>
                        </div>
                        <button
                            onClick={() => navigate('/client-details')}
                            className="flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition"
                        >
                            <Plus size={20} />
                            <span>Add New Client</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search clients by name or username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                        />
                    </div>
                </div>

                {/* Clients Grid */}
                {filteredClients.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="mb-6">
                            <User size={64} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">No Clients Yet</h3>
                            <p className="text-gray-400 mb-8">Start by adding your first client to get started</p>
                        </div>
                        <button
                            onClick={() => navigate('/client-details')}
                            className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition"
                        >
                            <Plus size={20} />
                            <span>Add Your First Client</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClients.map((client) => (
                            <div
                                key={client.id}
                                className="bg-card rounded-lg border border-gray-800 overflow-hidden hover:border-primary/50 transition group"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-primary/20 to-transparent p-6 border-b border-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                            <User size={24} className="text-black" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditClick(client)}
                                                className="p-2 bg-gray-700 rounded-lg hover:bg-primary hover:text-black transition"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClient(client.id)}
                                                className="p-2 bg-gray-700 rounded-lg hover:bg-red-600 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{client.name}</h3>
                                    <p className="text-sm text-gray-400">@{client.userName}</p>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    {/* Contact Info */}
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Phone size={18} className="text-primary" />
                                        <span className="text-sm">{client.phoneNumber}</span>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-700">
                                        <div className="text-center">
                                            <p className="text-gray-500 text-xs uppercase mb-1">Height</p>
                                            <p className="text-white font-bold text-lg">{client.height} cm</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500 text-xs uppercase mb-1">Weight</p>
                                            <p className="text-white font-bold text-lg">{client.weight} kg</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500 text-xs uppercase mb-1">BMI</p>
                                            <p className="text-primary font-bold text-lg">
                                                {calculateBMI(client.height, client.weight)}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500 text-xs uppercase mb-1">Age</p>
                                            <p className="text-white font-bold text-lg">{client.age} yrs</p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Gender:</span>
                                            <span className="text-white font-medium">{client.gender}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Workout Frequency:</span>
                                            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                                                <Dumbbell size={14} className="text-primary" />
                                                <span className="text-primary font-medium">{client.workoutfrequency}x/week</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-800">
                                    <button
                                        onClick={() => navigate('/dashboard', { state: { clientId: client.id } })}
                                        className="w-full text-primary font-semibold hover:text-primary/80 transition text-sm"
                                    >
                                        View Progress →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Summary */}
                {clients.length > 0 && (
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-card rounded-lg p-6 border border-gray-800">
                            <p className="text-gray-400 text-sm mb-2">Total Clients</p>
                            <p className="text-4xl font-bold text-primary">{clients.length}</p>
                        </div>
                        <div className="bg-card rounded-lg p-6 border border-gray-800">
                            <p className="text-gray-400 text-sm mb-2">Average Age</p>
                            <p className="text-4xl font-bold text-primary">
                                {(
                                    clients.reduce((sum, c) => sum + c.age , 0) / clients.length
                                ).toFixed(1)}
                            </p>
                        </div>
                        <div className="bg-card rounded-lg p-6 border border-gray-800">
                            <p className="text-gray-400 text-sm mb-2">Avg. Workout Frequency</p>
                            <p className="text-4xl font-bold text-primary">
                                {(
                                    clients.reduce((sum, c) => sum + c.workoutfrequency || 0, 0) / clients.length
                                ).toFixed(1)}
                                x
                            </p>
                        </div>
                        <div className="bg-card rounded-lg p-6 border border-gray-800">
                            <p className="text-gray-400 text-sm mb-2">Avg. BMI</p>
                            <p className="text-4xl font-bold text-primary">
                                {(
                                    clients.reduce(
                                        (sum, c) =>
                                            sum +
                                            parseFloat(
                                                calculateBMI(c.height, c.weight) === 'N/A'
                                                    ? '0'
                                                    : calculateBMI(c.height, c.weight)
                                            ),
                                        0
                                    ) / clients.length
                                ).toFixed(1)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingClient && editFormData && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-lg border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-card">
                            <h3 className="text-2xl font-bold text-white">Edit Client Details</h3>
                            <button
                                onClick={handleCancelEdit}
                                className="p-2 hover:bg-gray-800 rounded-lg transition"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Personal Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Personal Information</h4>
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                        />
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="userName"
                                            value={editFormData.userName}
                                            onChange={handleEditFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={editFormData.phoneNumber}
                                            onChange={handleEditFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Physical Details */}
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Physical Details</h4>
                                <div className="space-y-4">
                                    {/* Height */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Height (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name="height"
                                            value={editFormData.height}
                                            onChange={handleEditFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                        />
                                    </div>

                                    {/* Weight */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Weight (kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={editFormData.weight}
                                            onChange={handleEditFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                        />
                                    </div>

                                    {/* Age */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Age (years)
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={editFormData.age}
                                            onChange={handleEditFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={editFormData.gender}
                                            onChange={handleEditFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Workout Frequency */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Workout Frequency (days/week)
                                        </label>
                                        <select
                                            name="workoutfrequency"
                                            value={editFormData.workoutfrequency}
                                            onChange={handleEditFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition"
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-4 p-6 border-t border-gray-800 bg-gray-900/50">
                            <button
                                onClick={handleCancelEdit}
                                className="flex-1 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="flex-1 px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
