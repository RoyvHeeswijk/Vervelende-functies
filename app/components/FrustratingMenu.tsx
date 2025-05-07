'use client';

import { useState, useEffect } from 'react';

const menuItems = [
    'Home', 'About', 'Services', 'Products', 'Contact', 'Blog', 'Careers',
    'Support', 'Documentation', 'Pricing', 'Features', 'Resources', 'Team',
    'News', 'Events', 'Gallery', 'FAQ', 'Terms', 'Privacy', 'Sitemap',
    'Login', 'Register', 'Dashboard', 'Settings', 'Profile', 'Messages',
    'Notifications', 'Help Center', 'API', 'Developers', 'Partners'
];

export default function FrustratingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Simulate delayed menu opening
    const handleMenuClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsOpen(!isOpen);
            setIsLoading(false);
        }, 800);
    };

    // Gradually reveal items on hover
    useEffect(() => {
        if (isOpen) {
            const interval = setInterval(() => {
                setVisibleItems(prev => {
                    if (prev.length >= menuItems.length) {
                        clearInterval(interval);
                        return prev;
                    }
                    return [...prev, prev.length];
                });
            }, 100);
            return () => clearInterval(interval);
        } else {
            setVisibleItems([]);
        }
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                onClick={handleMenuClick}
                className="w-48 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'Open Menu'}
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-500 opacity-0 hover:opacity-100"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setTimeout(() => setIsOpen(false), 500)}
                >
                    <div className="max-h-96 overflow-y-auto">
                        {menuItems.map((item, index) => (
                            <div
                                key={item}
                                className={`px-4 py-2 cursor-pointer transition-all duration-300 ${visibleItems.includes(index) ? 'opacity-100' : 'opacity-0'
                                    } ${hoveredItem === index
                                        ? 'bg-blue-100 transform translate-x-2'
                                        : 'hover:bg-gray-100'
                                    }`}
                                onMouseEnter={() => {
                                    setTimeout(() => setHoveredItem(index), 200);
                                }}
                                onMouseLeave={() => setHoveredItem(null)}
                                style={{
                                    transitionDelay: `${index * 50}ms`,
                                    transform: hoveredItem === index ? 'translateX(10px)' : 'translateX(0)',
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 