'use client';

import React, { useState, useEffect } from 'react';

const UpdateSettingsForm = ({ settings, fetchSettings }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settingForm, setSettingForm] = useState({
    deliveryCharge: '',
    taxPercentage: '',
    smallDeliveryCharge: '',
    mediumDeliveryCharge: '',
    largeDeliveryCharge: '',
    other1: '',
    other2: '',
  });

  useEffect(() => {
    if (settings) {
      setSettingForm({
        deliveryCharge: settings.deliveryCharge || '',
        taxPercentage: settings.taxPercentage || '',
        smallDeliveryCharge: settings.smallDeliveryCharge || '',
        mediumDeliveryCharge: settings.mediumDeliveryCharge || '',
        largeDeliveryCharge: settings.largeDeliveryCharge || '',
        other1: settings.other1 || '',
        other2: settings.other2 || '',
      });
    }
  }, [settings]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSettingForm({ ...settingForm, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/settings/${settings.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingForm),
      });

      if (response.ok) {
        fetchSettings();
        alert('Settings updated successfully!');
      } else {
        console.error('Failed to update settings');
        alert('Failed to update settings. Please try again.');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('An error occurred while updating settings.');
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white p-6 w-[600px] rounded shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Update Settings</h2>
        <form onSubmit={handleFormSubmit}>
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Charge</label>
              <input
                type="number"
                name="deliveryCharge"
                value={settingForm.deliveryCharge}
                onChange={handleFormChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax Percentage</label>
              <input
                type="number"
                name="taxPercentage"
                value={settingForm.taxPercentage}
                onChange={handleFormChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Small Delivery Charge</label>
              <input
                type="number"
                name="smallDeliveryCharge"
                value={settingForm.smallDeliveryCharge}
                onChange={handleFormChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Medium Delivery Charge</label>
              <input
                type="number"
                name="mediumDeliveryCharge"
                value={settingForm.mediumDeliveryCharge}
                onChange={handleFormChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Large Delivery Charge</label>
              <input
                type="number"
                name="largeDeliveryCharge"
                value={settingForm.largeDeliveryCharge}
                onChange={handleFormChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cash On Delivery Charges</label>
              <input
                type="number"
                name="other1"
                value={settingForm.other1}
                onChange={handleFormChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Row 4 */}
          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Other2</label>
            <input
              type="number"
              name="other2"
              value={settingForm.other2}
              onChange={handleFormChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSettingsForm;
