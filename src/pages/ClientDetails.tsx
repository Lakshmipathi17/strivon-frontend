import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
const API = import.meta.env.VITE_API_BASE_URL;

interface ClientData {
    name: string;
    userName: string;
    phoneNumber: string;
    password: string;
    height: number;
    weight: number;
    workoutfrequency: number;
    gender: string;
    age: number;
}

export default function ClientDetails() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<ClientData>({
        name: '',
        userName: '',
        phoneNumber: '',
        password: '',
        height: 170,
        weight: 70,
        workoutfrequency: 3,
        gender: '',
        age: 21,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.userName || !formData.phoneNumber || !formData.password) {
                alert('Please fill all fields');
                return;
            }
        }
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!formData.height || !formData.weight || !formData.gender || !formData.age) {
            alert('Please fill all fields');
            return;
        }
        const token = localStorage.getItem("token");
        await fetch(`${API}/user-signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        // Reset form
        setFormData({
            name: '',
            userName: '',
            phoneNumber: '',
            password: '',
            height: 170,
            weight: 70,
            workoutfrequency: 3,
            gender: '',
            age: 21,
        });
        setStep(1);

        // Navigate to clients list
        navigate('/clients-list');
    };

    return (
        <div className="min-h-screen bg-dark pt-24">
            <header className="fixed top-0 left-0 right-0 bg-dark/80 backdrop-blur-lg border-b border-gray-800 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <div className="w-30 h-20 flex items-center justify-center">
                            <img src="src/assets/images/logo.png" alt="Strivon Logo" className="h-40 w-auto object-contain" />
                        </div>
                    </div>
                </div>
            </header>
            <div className="max-w-2xl mx-auto px-6 py-12">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                            step >= 1 ? 'bg-primary text-black' : 'bg-gray-700 text-white'
                        }`}>
                            1
                        </div>
                        <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-700'}`}></div>
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                            step >= 2 ? 'bg-primary text-black' : 'bg-gray-700 text-white'
                        }`}>
                            2
                        </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Basic Info</span>
                        <span>Physical Details</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-card rounded-lg p-8 border border-gray-800">
                    {step === 1 ? (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-8">Add Client - Step 1</h2>
                            <p className="text-gray-400 mb-8">Enter basic client information</p>

                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Lucky"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
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
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        placeholder="lucky123"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
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
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 123-4567"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={handleNextStep}
                                className="w-full mt-8 flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition"
                            >
                                <span>Next</span>
                                <ArrowRight size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-8">Add Client - Step 2</h2>
                            <p className="text-gray-400 mb-8">Enter physical details and preferences for {formData.name}</p>

                            <div className="space-y-6">
                                {/* Height */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        placeholder="170"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
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
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        placeholder="75"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                    />
                                </div>

                                {/* Workout Frequency */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Workout Frequency
                                    </label>
                                    <select
                                        name="workoutFrequency"
                                        value={formData.workoutfrequency}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition"
                                    >
                                        <option value="1">1 day a week</option>
                                        <option value="2">2 days a week</option>
                                        <option value="3">3 days a week</option>
                                        <option value="4">4 days a week</option>
                                        <option value="5">5 days a week</option>
                                        <option value="6">6 days a week</option>
                                        <option value="7">7 days a week</option>
                                    </select>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        placeholder="25"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                                    />
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handlePreviousStep}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition border border-gray-700"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Previous</span>
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition"
                                >
                                    <span>Complete & View Clients</span>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}