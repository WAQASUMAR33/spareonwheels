import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "Are your parts genuine?",
            answer: "Yes, we offer genuine, high-quality OEM and aftermarket parts sourced from trusted manufacturers. Each part undergoes a thorough quality check before it’s added to our catalog."
        },
        {
            question: "How do I know if a part will fit my car?",
            answer: "We make it easy to find compatible parts! Use our part search tool by entering your car's make and model, or reach out to our customer support for guidance."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept major credit and debit cards, online bank transfers, and cash on delivery options to suit your preference."
        },
        {
            question: "How long will delivery take?",
            answer: "Delivery times vary based on your location and chosen delivery method. We offer both standard and express delivery options, with standard delivery typically taking 3-5 business days."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a hassle-free return policy within 30 days of purchase on unused, unopened items. Please contact our support team for assistance with returns."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className='bg-black'>
            <div className="w-full md:px-20 px-4 md:py-10 py-6 bg-white rounded-b-[30px] md:rounded-b-[60px]">
                <h1 className="text-3xl font-semibold mb-6">FAQ's</h1>
                <div className="grid grid-cols-1 md:grid-cols-1 md:gap-6">
                    {/* First Column */}
                    <div className="md:border-2 border-gray-200 rounded-lg p-2">
                        {faqs.map((faq, index) => (
                            <div key={index} className="py-4 md:border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <h2 className="text-sm md:text-xl font-medium text-gray-800">{faq.question}</h2>
                                    <FaChevronDown
                                        className={`text-sm md:text-xl text-gray-600 transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                {activeIndex === index && (
                                    <p className="mt-2 text-gray-600 text-sm md:text-base">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Second Column */}
                    {/* <div className="md:border-2 border-gray-200 md:rounded-r-lg p-2">
                        {faqs.slice(5).map((faq, index) => (
                            <div key={index + 5} className="py-4 md:border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleFAQ(index + 5)}
                                >
                                    <h2 className=" text-sm md:text-xl font-medium text-gray-800">{faq.question}</h2>
                                    <FaChevronDown
                                        className={`text-sm md:text-xl text-gray-600 transform transition-transform ${activeIndex === index + 5 ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                {activeIndex === index + 5 && (
                                    <p className="mt-2 text-gray-600 text- md:text-base">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>
        </div>
    );
}
