import React from 'react';
import { AiFillStar } from 'react-icons/ai';

export default function WhatOurCustomerSays() {
    return (
        <div className="w-full h-auto px-4 md:px-16 py-8">
            <h1 className="text-3xl font-semibold mb-6">What our customers say</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image Section */}
                <div className="rounded-xl overflow-hidden">
                    <img 
                        src="/images/image.png" // replace with actual image path
                        alt="Customer"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Testimonial Section */}
                <div className="md:col-span-2 space-y-4 flex flex-col justify-center md:px-8">
                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, index) => (
                            <AiFillStar key={index} className="text-yellow-400" />
                        ))}
                        <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full">
                            5.0
                        </span>
                    </div>

                    {/* Customer Name and Position */}
                    <div>
                        <h2 className="text-lg font-semibold">Ali TUFAN</h2>
                        <p className="text-gray-500">Designer</p>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-800 text-[22px] leading-relaxed">
                        I'd suggest Macklin Motors Nissan Glasgow South to a friend because I had great service from my salesman Patrick and all of the team.
                    </p>
                </div>
            </div>
        </div>
    );
}
