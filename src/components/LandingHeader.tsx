import { LogIn } from 'lucide-react';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function LandingHeader() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-dark/80 backdrop-blur-lg border-b border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-30 h-20 flex items-center justify-center">
              <img src="src/assets/images/logo.png" alt="Strivon Logo" className="h-40 w-auto object-contain" />
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={() => setIsLoginOpen(true)}
            className="flex items-center gap-2 bg-primary text-black font-semibold px-6 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            <LogIn size={20} />
            <span>Login</span>
          </button>
        </div>
      </header>
      {isLoginOpen && <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}
