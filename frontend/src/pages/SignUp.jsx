import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BottomWarning } from '../components/BottomWarning';
import { LongButton } from '../components/LongButton';
import { Heading } from '../components/Heading';
import { InputBox } from '../components/InputBox';
import { SubHeading } from '../components/SubHeading';
import AppBar from '../components/AppBar';
import { API_ENDPOINTS } from '../apiConfig';
import { useAuth } from '../context/AuthContext';  // Assuming you have an AuthContext

export const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();  // Using setUser from AuthContext to handle authentication state

    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent the form from refreshing the page
        try {
            const response = await axios.post(API_ENDPOINTS.register, {
                firstName,
                lastName,
                username,
                password
            }, { withCredentials: true });  // Ensure withCredentials is set to send cookies

            if (response.status === 201) {
                setUser({ username, firstName, lastName });  // Set user in context
                alert("User signed up successfully!");
                navigate("/home");  
            }
        } catch (error) {
            console.error('Signup failed:', error);
            alert("Signup failed: " + error.response.data.message);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

        return <div>
            <AppBar />
            <div className="bg-slate-200 h-screen flex justify-center" onKeyDown={handleKeyPress}>
                <div className="flex flex-col justify-center mt-12">
                    <div className="rounded-lg bg-white w-80 text-center p-1 h-max px-4 mt-4">
                        <Heading label="Sign up" />
                        <SubHeading label="Enter your information to create an account" />
                        <InputBox onChange={(e) => setFirstName(e.target.value)} placeholder="John" label="First Name" />
                        <InputBox onChange={(e) => setLastName(e.target.value)} placeholder="Doe" label="Last Name" />
                        <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="johndoe@gmail.com" label="Email" />
                        <InputBox type="password" onChange={(e) => setPassword(e.target.value)} placeholder="john@12345" label="Password" />
                        <div className="pt-2">
                            <LongButton onClick={handleSubmit} label="Sign up" />
                        </div>
                        <BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />
                    </div>
                </div>
            </div>
        </div>
    };