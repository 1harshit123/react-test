import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        console.log(e)
        e.preventDefault();
        // Simulate login by storing email in localStorage
        localStorage.setItem('userEmail', email);
        navigate('/fund-selection');
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-9 bg-white p-6 rounded shadow-md w-80 h-1/2">
                <h2 className="text-2xl mb-4 font-semibold text-center">Login</h2>
                <div className='flex flex-col gap-4'>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full mb-3 p-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full mb-4 p-2 border rounded"
                    />
                </div>
                
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
