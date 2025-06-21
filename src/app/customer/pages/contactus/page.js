'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import { FaDiscord, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
// import LocationMap from './locationmap';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Your message has been sent successfully!');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='bg-black'>
        <Head>
          <title>Contact Us - Sparesonwheel.com</title>
          <meta name="description" content="Get in touch with Sparesonwheel.com. We would love to hear from you!" />
        </Head>
        <div className="bg-white py-12">
          <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
            {/* Left Column - Contact Information */}
            <div className="bg-black text-sm md:text-base text-white p-8 rounded-lg flex flex-col space-y-6 lg:w-1/3">
              <h2 className="text-2xl md:text-3xl font-bold">Contact Information</h2>
              <p className="text-gray-300">Say something to start contact with us!</p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaPhoneAlt className="text-xl" />
                  <a href="tel:03337281665" className="text-gray-300 hover:text-blue-600">
                    03337281665
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-xl" />
                  <a href="mailto:contact@sparesonwheels.com" className="text-gray-300 hover:text-blue-600">
                    contact@sparesonwheels.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-xl" />
                  <a
                    className="text-gray-300 hover:text-blue-600"
                  >
                    Suit M37, Maznine floor, Harmain Tower, block 1, Gulistan e Johar, Karachi
                  </a>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-white"><FaTwitter size={20} /></a>
                <a href="#" className="text-gray-300 hover:text-white"><FaInstagram size={20} /></a>
                <a href="#" className="text-gray-300 hover:text-white"><FaDiscord size={20} /></a>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg lg:w-2/3">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Write your message..."
                  ></textarea>
                </div>
                {success && <p className="text-green-500">{success}</p>}
                {error && <p className="text-[#FF0000]">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#FF0000] text-white py-2 px-4 rounded-full hover:bg-red-700 transition-colors duration-300 flex items-center gap-2"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <FiSend />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className=' bg-white rounded-b-[60px] pb-6 overflow-hidden'>
          {/* <LocationMap /> */}
        </div>
      </div>
    </>
  );
};

export default Contact;
