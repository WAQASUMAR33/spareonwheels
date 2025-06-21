import { FaShippingFast, FaHeadset, FaCheckCircle } from "react-icons/fa";

export default function ServiceSection() {
  return (
    <div className="flex justify-center bg-white py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        {/* Free and Fast Delivery */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center bg-gray-300 rounded-full p-4 mb-4">
            <FaShippingFast className="text-5xl text-white bg-black rounded-full p-2" />
          </div>
          <h3 className="text-lg font-bold">FREE AND FAST DELIVERY</h3>
          <p className="text-sm text-gray-600">Free delivery for all orders over 500,000</p>
        </div>

        {/* 24/7 Customer Service */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center bg-gray-300 rounded-full p-4 mb-4">
            <FaHeadset className="text-5xl text-white bg-black rounded-full p-2" />
          </div>
          <h3 className="text-lg font-bold">24/7 CUSTOMER SERVICE</h3>
          <p className="text-sm text-gray-600">Friendly 24/7 customer support</p>
        </div>

        {/* Customer Satisfaction */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center bg-gray-300 rounded-full p-4 mb-4">
            <FaCheckCircle className="text-5xl text-white bg-black rounded-full p-2" />
          </div>
          <h3 className="text-lg font-bold">CUSTOMER SATISFACTION</h3>
          <p className="text-sm text-gray-600">100% Customer satisfaction</p>
        </div>
      </div>
    </div>
  );
}
