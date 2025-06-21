'use client';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FaqSection = () => {
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
    <div className="container mx-auto md:py-8 md:px-8">
      <div className="flex flex-col md:flex-row">
        
        <div className="w-full bg-white rounded-lg shadow-lg p-0 sm:p-6 lg:p-8">
          {faqs.map((faq, index) => (
            <div key={index} className={`p-4 border-b ${activeIndex === index ? 'bg-gray-100' : ''}`}>
              <div 
                className="flex items-center cursor-pointer justify-between" 
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-sm md:text-base sm:text-lg font-medium text-gray-800 flex-1">{faq.question}</span>
                {activeIndex === index ? (
                  <FiChevronUp className="text-gray-600 ml-4" />
                ) : (
                  <FiChevronDown className="text-gray-600 ml-4" />
                )}
              </div>
              <div className={`overflow-hidden transition-all duration-500 ${activeIndex === index ? 'max-h-screen' : 'max-h-0'}`}>
                <p className="mt-4 text-sm sm:text-base text-gray-700">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
