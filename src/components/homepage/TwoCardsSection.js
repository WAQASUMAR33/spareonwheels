import React from 'react';
import { FaArrowRight, FaCar } from 'react-icons/fa';

export default function TwoCardsSection() {
    return (
        <div className="px-4 md:px-24 py-8 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Card */}
            <div className="p-8 md:p-16 rounded-lg bg-[#FDB9BA] flex flex-col justify-between items-start relative">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-white">
                        Are You Looking <br /> For Auto Parts?
                    </h1>
                    <p className="text-white mb-4 text-sm md:text-base">
                        We are committed to providing our customers with exceptional service.
                    </p>
                    <button className="mt-4 inline-flex items-center bg-[#FC0004] text-white py-2 px-4 md:py-4 md:px-6 rounded-lg text-sm md:text-base hover:bg-[#FF0000]">
                        Get Started <FaArrowRight className="ml-2 transform -rotate-45" />
                    </button>
                </div>
                <FaCar className="absolute bottom-4 md:bottom-12 right-4 md:right-12 text-white text-6xl md:text-8xl" />
            </div>

            {/* Second Card */}
            <div className="p-8 md:p-16 rounded-lg bg-gray-800 flex flex-col justify-between items-start relative">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-white">
                        Do You Want to <br /> Buy parts of any Car?
                    </h1>
                    <p className="text-white mb-4 text-sm md:text-base">
                        We are committed to providing our customers with exceptional service.
                    </p>
                    <button className="mt-4 inline-flex items-center bg-black text-white py-2 px-4 md:py-4 md:px-6 rounded-lg text-sm md:text-base hover:bg-[#FF0000]">
                        Get Started <FaArrowRight className="ml-2 transform -rotate-45" />
                    </button>
                </div>
                <FaCar className="absolute bottom-4 md:bottom-12 right-4 md:right-12 text-white text-6xl md:text-8xl" />
            </div>
        </div>
    );
}
