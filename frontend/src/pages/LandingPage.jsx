import React from 'react';
import AppBar from '../components/AppBar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

const LandingPage = () => (
    <div className="flex flex-col min-h-screen">
        <AppBar />
        <HeroSection />
        <Footer />
    </div>
);

export default LandingPage;
