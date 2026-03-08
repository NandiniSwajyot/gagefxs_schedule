import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';

// Lottie animations
import InventoryManagerAnim from '../../assets/InventoryManager.json';
import CalibrationManagerAnim from '../../assets/CalibrationManager.json';
import Invoice from '../../assets/register.json';
import Revenue from '../../assets/Revenue (1).json'; // Capital R

const DashboardCard = ({ title, description, to, animation, gradient }) => {
    return (
        <Link to={to} className="block h-full no-underline group">
            <div
                className="
          h-full rounded-2xl overflow-hidden 
          bg-white
          border border-gray-200
          shadow-md transition-all duration-300
          hover:shadow-xl hover:-translate-y-1
        "
            >
                <div
                    className={`
            w-full h-56
            flex items-center justify-center
            ${gradient}
            border-b border-gray-200
          `}
                >
                    <Lottie
                        animationData={animation}
                        loop={true}
                        autoplay={true}
                        className="w-65 h-60"
                    />
                </div>

                <div className="p-6 flex flex-col items-center text-center h-[calc(100%-14rem)]">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {title}
                    </h3>

                    <p
                        className="
              mt-4 text-sm leading-relaxed
              text-blue-600
              opacity-0 max-h-0
              group-hover:opacity-100 group-hover:max-h-40
              transition-all duration-300
            "
                    >
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    );
};

const ACCMANAGERDashboard = () => {

    const cards = [
        {
            title: 'Challan Management',
            description:
                'Create, track, and manage challans efficiently with complete visibility and control.',
            to: '/admin/challan',
            animation: Invoice, // Using Revenue animation
            gradient: 'bg-gradient-to-br from-indigo-50 via-white to-indigo-100',
        },
        {
            title: 'Gage Management',
            description:
                'Manage gage costs, track lifecycle status, and ensure proper monitoring across plants.',
            to: '/admin/gageprices',
           animation: Revenue,
            gradient: 'bg-gradient-to-br from-blue-50 via-white to-blue-100',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4 py-8 md:px-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                        Account Manager Dashboard
                    </h1>

                    <div className="flex justify-center mt-6">
                        <div className="w-24 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                    </div>
                </header>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {cards.map((card, index) => (
                        <DashboardCard
                            key={index}
                            title={card.title}
                            description={card.description}
                            to={card.to}
                            animation={card.animation}
                            gradient={card.gradient}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ACCMANAGERDashboard;