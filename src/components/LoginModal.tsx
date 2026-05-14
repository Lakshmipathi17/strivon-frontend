import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL;

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //API call to backend for authentication can be made here
        const loginResponse = await fetch(`${API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userName, password })
        });
        if(!loginResponse.ok){
            const errorMessage = await loginResponse.text();
            alert(errorMessage);
            return;
        }
        const data =await loginResponse.json();
        //Store token in localStorage for authentication
        localStorage.setItem("token", data.token);
        localStorage.setItem("Trainer", data.trainer);
        if(data.trainer){
            navigate("/clients-list");
        }else{
            navigate("/dashboard");
        }
    }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 w-full max-w-md relative shadow-xl border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Welcome Back</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
              placeholder="Enter your user name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-black font-semibold py-2 rounded-lg hover:bg-primary/90 transition mt-6"
          >
            Sign In
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account?{' '}
            <a href="/" className="text-primary hover:text-primary/80 transition">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
