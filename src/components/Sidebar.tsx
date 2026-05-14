import { Home, BarChart2, Target, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-card p-4 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-primary">Strivon</h1>

      <nav className="flex flex-col gap-4">
        <NavItem icon={<Home />} label="Dashboard" active />
        <NavItem icon={<BarChart2 />} label="Analytics" />
        <NavItem icon={<Target />} label="Goals" />
        <NavItem icon={<Settings />} label="Settings" />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }: any) {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
        active ? "bg-primary/20 text-primary" : "hover:bg-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}