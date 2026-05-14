import { BarChart3, Dumbbell, Target, Settings, LogOut } from 'lucide-react';

interface DashboardSidebarProps {
    activeTab: string;
    clientName: string;
    clientUserName: string
    clientId?: string | number | null;
    onTabChange: (tab: string) => void;
}

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardSidebar({ activeTab, onTabChange, clientName, clientUserName, clientId }: DashboardSidebarProps) {
    const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('Trainer');
    localStorage.removeItem('selfTrainedUser');
    localStorage.removeItem('clients');
    localStorage.removeItem('workouts')
    localStorage.removeItem(`analytics-${clientId}`);
    window.location.href = '/';
}
    return (
        <aside className="fixed left-0 top-0 pt-24 w-64 h-screen bg-dark border-r border-gray-800 p-6">
            {/* User Profile Section */}
            <div className="mb-8">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3">
                    <span className="text-black font-bold text-lg">{clientName.charAt(0)}</span>
                </div>
                <h3 className="text-white font-bold">{clientName}</h3>
                <p className="text-gray-400 text-sm">@{clientUserName}</p>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2 flex-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                activeTab === item.id
                                    ? 'bg-primary text-black font-semibold'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition border border-gray-800">
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
}
