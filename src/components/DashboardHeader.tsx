import { Bell } from 'lucide-react';

interface DashboardHeaderProps {
    clientName: string;
}

export default function DashboardHeader({ clientName }: DashboardHeaderProps) {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <header className="fixed top-0 left-0 right-0 bg-dark/80 backdrop-blur-lg border-b border-gray-800 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-30 h-10 flex items-center justify-center">
              <img src="src/assets/images/logo.png" alt="Strivon Logo" className="h-40 w-auto object-contain" />
            </div>
          </div>

                {/* Center - Greeting */}
                <div className="text-center">
                    <p className="text-gray-400 text-sm">{greeting} {clientName}</p>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <button className="relative p-2 hover:bg-gray-800 rounded-lg transition">
                        <Bell size={24} className="text-gray-400 hover:text-primary transition" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
