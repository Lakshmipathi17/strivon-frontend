import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
const API = import.meta.env.VITE_API_BASE_URL;

interface UserDetails {
    id?: number;
    name: string;
    userName: string;
    email: string;
    phoneNumber: string;
    workoutFrequency?: string;
    age: number;
    height: number;
    weight: number;
    gender: string;
}

export default function Settings({clientId}: {clientId: number}) {
    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: '',
        userName: '',
        email: '',
        phoneNumber: '',
        age: 0,
        height: 0,
        weight: 0,
        gender: '',
    });

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // Load user details from localStorage
        let client =null;
        if(localStorage.getItem('Trainer') === 'true'){
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            client = clients.find((c: any) => c.id === clientId);
        }else{
            client = JSON.parse(localStorage.getItem('selfTrainedUser') || '{}');
        }
        if (client) {
            try {
                setUserDetails({
                    id: client.id,
                    name: client.name || '',
                    userName: client.userName || '',
                    email: client.email || '',
                    phoneNumber: client.phoneNumber || '',
                    age: client.age ? parseInt(client.age) : 0,
                    height: client.height ? parseInt(client.height) : 0,
                    weight: client.weight ? parseInt(client.weight) : 0,
                    gender: client.gender || '',
                    workoutFrequency: client.workoutFrequency || '',
                });
            } catch (error) {
                console.error('Error loading user details:', error);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({
            ...prev,
            [name]: ['age', 'height', 'weight'].includes(name) ? (value ? parseInt(value) : 0) : value,
        }));
        setIsSaved(false);
    };

    const handleSave = async () => {
        // Validate required fields
        if (!userDetails.name || !userDetails.userName || !userDetails.age || !userDetails.height || !userDetails.weight) {
            alert('Please fill all required fields');
            return;
        }

        // Save to localStorage
        if(localStorage.getItem('Trainer') === 'true'){
            const clientsData = JSON.parse(localStorage.getItem('clients') || '[]');
            clientsData.map((client: UserDetails) => { client.id ===clientId ? userDetails : client;});
            localStorage.setItem('clients', JSON.stringify(clientsData));
        }else{
            localStorage.setItem('selfTrainedUser', JSON.stringify(userDetails));
        }
        
        //API call to update user details in the backend
        try {
            await fetch(`${API}/trainer/client-details/edit/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(userDetails),
            });
        } catch (error) {
            console.error('Error updating user details:', error);
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-8">
            {/* Success Message */}
            {isSaved && (
                <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Settings saved successfully!
                </div>
            )}

            {/* Settings Form */}
            {!isSaved && 
            <div className="bg-card rounded-lg p-6 border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                    <SettingsIcon size={28} />
                    Personal Details
                </h3>

                <div className="space-y-6">
                    {/* Name and Username */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={userDetails.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="userName"
                                value={userDetails.userName}
                                onChange={handleChange}
                                placeholder="johndoe123"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                            />
                        </div>
                    </div>

                    {/* Email and Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={userDetails.phoneNumber}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                        />
                    </div>
                    {/* Age, Height, Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Age <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={userDetails.age || ''}
                                onChange={handleChange}
                                placeholder="25"
                                min="1"
                                max="120"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Height (cm) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={userDetails.height || ''}
                                onChange={handleChange}
                                placeholder="170"
                                min="50"
                                max="250"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Weight (kg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={userDetails.weight || ''}
                                onChange={handleChange}
                                placeholder="75"
                                step="0.5"
                                min="20"
                                max="300"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                        <select
                            name="gender"
                            value={userDetails.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition"
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </div>
            }

            {/* Additional Info */}
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-6">
                <h4 className="text-white font-bold mb-2">ℹ️ Information</h4>
                <p className="text-gray-400 text-sm">
                    Please update your physical details to get personalized workout and nutrition recommendations. Your data is stored securely and will not be shared with third parties without your consent.
                </p>
            </div>
        </div>
    );
}
