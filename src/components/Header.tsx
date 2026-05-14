import { Bell, Search, Moon } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center justify-between mb-6">
      
      {/* Left - Greeting */}
      <div>
        <p className="text-gray-400 text-sm">Good morning</p>
        <h1 className="text-2xl font-bold">Welcome Back 👋</h1>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        
        {/* Search */}
        <div className="bg-card p-2 rounded-full hover:bg-gray-700 cursor-pointer">
          <Search size={18} />
        </div>

        {/* Notifications */}
        <div className="relative bg-card p-2 rounded-full hover:bg-gray-700 cursor-pointer">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 bg-primary text-xs px-1 rounded-full">
            2
          </span>
        </div>

        {/* Theme Toggle (optional) */}
        <div className="bg-card p-2 rounded-full hover:bg-gray-700 cursor-pointer">
          <Moon size={18} />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-full cursor-pointer hover:bg-gray-700">
            
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm">Michael</span>
        </div>

      </div>
    </div>
  );
}