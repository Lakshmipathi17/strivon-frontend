import { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import type {FormEvent , ChangeEvent} from 'react';
import logo from '../assets/images/logo.png';
const API = import.meta.env.VITE_API_BASE_URL;

export default function TrainerLoginPage() {
    const [userName, setUserName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!userName.trim()){
            alert('User Name is required');
            return;
        }
        if(!phoneNumber.trim()){
            alert('Phone Number is required');
            return;
        }
        if(!password.trim()){
            alert('Password is required');
            return;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            alert('Enter a valid 10-digit phone number');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        //API call to backend for authentication can be made here
        try{
            setLoading(true);
            //SignUp API call
            const signUpResponse =await fetch(`${API}/trainer-signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userName,
                    phoneNumber,
                    password
                })
            });
            if (!signUpResponse.ok) {
                const errorMessage = await signUpResponse.text(); // backend sends string
                throw new Error(errorMessage);
            }
            // Login API call
            const loginResponse = await fetch(`${API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userName,
                    password
                })
            });
            const data = await loginResponse.json();
            //Store token in localStorage for authentication
            localStorage.setItem("token", data.token);
            localStorage.setItem("Trainer", data.trainer);

            //Step 4 Navigate
            navigate("/client-details");
        } catch (error:any) {
            alert(error.message || 'An error occurred during sign up');
        } finally {
            setLoading(false);
        }
    };
    const isDisabled = !userName || !phoneNumber || !password || loading;
    return (
    <>
      {/* Header */}
    <header className="fixed top-0 left-0 right-0 bg-dark/80 backdrop-blur-lg border-b border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
            <div className="w-30 h-20 flex items-center justify-center">
                <img src={logo} alt="Strivon Logo" className="h-40 w-auto object-contain" />
            </div>
            </div>
        </div>
    </header>

      {/* Form */}
      <div className="min-h-screen flex items-center justify-center bg-black-100 pt-24">
        <div className="bg-card rounded-lg p-8 w-full max-w-md shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Join Strivon as a Trainer
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUserName(e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="Enter username"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPhoneNumber(e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="Enter phone number"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className="w-full bg-primary text-black font-semibold py-2 rounded-lg hover:bg-primary/90 transition mt-6 disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </>
 );
}