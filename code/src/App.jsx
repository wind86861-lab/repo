import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Clinics from './pages/Clinics';
import CheckupPackages from './pages/CheckupPackages';
import ClinicCheckupPackages from './pages/ClinicCheckupPackages';
import PublicCheckupPackages from './pages/PublicCheckupPackages';
import AdminProfile from './pages/AdminProfile';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false, retry: false }
    }
});

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // Apply theme to the whole document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className={`app-container ${theme} ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                    <div className="main-content">
                        <Header
                            toggleSidebar={toggleSidebar}
                            isSidebarOpen={isSidebarOpen}
                            isDarkMode={theme === 'dark'}
                            toggleTheme={toggleTheme}
                        />

                        <div className="content-wrapper">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/clinics" element={<Clinics />} />
                                <Route path="/packages" element={<CheckupPackages />} />
                                <Route path="/clinic-packages" element={<ClinicCheckupPackages />} />
                                <Route path="/public-packages" element={<PublicCheckupPackages />} />
                                <Route path="/admin/profile" element={<AdminProfile />} />
                                {/* Add more routes here */}
                            </Routes>
                        </div>
                    </div>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
