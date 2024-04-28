import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Footer from '../components/Footer';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/signin', {
                username,
                password
            });
            localStorage.setItem('token', response.data.token);
            navigate('/home'); // Redirect to dashboard after successful login
        } catch (error) {
            console.error('SignIn failed:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <AppBar />
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-xs p-8 bg-white rounded shadow-md">
                    <h2 className="text-xl font-bold mb-6">Sign In</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mb-4 px-3 py-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-6 px-3 py-2 border rounded"
                    />
                    <button onClick={handleSignIn} className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700">Sign In</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignIn;
