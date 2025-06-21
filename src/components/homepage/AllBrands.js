import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function AllBrands() {
    
    const [make, setmake] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/make');

                console.log("TOP RADET Products are: ", response.data);
                setmake(response.data); // Assuming the API returns products in `data.data`
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="px-4 md:px-12 w-full h-auto flex flex-col py-4 md:py-8">
            <h1 className="text-2xl font-semibold mb-6">All Brands</h1>
            <div className="grid grid-cols-2 md:grid-cols-7 items-center overflow-x-auto w-80% gap-2 p-2">
            {make.slice(0, 6).map((brand) => (
                 <Link href={`/filteredproducts?make=${brand.make}&id=${brand.id}`}>
                    <div 
                        key={brand.id} 
                        className="w-40 h-40 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg shadow-md p-4"
                    >
                        <img 
                        src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${brand.image}`} 
                         alt={brand.image} className="w-20 h-20 object-contain mb-2" />
                        <p className="text-sm font-medium text-gray-700 uppercase">{brand.make}</p>
                    </div>
                    </Link>
                ))}
                {/* Show All Brands Link */}
                <div className="flex items-center ml-4 mt-4 md:mt-0">
                    <a href="/manufacture" className="text-gray-900 hover:underline flex items-center space-x-1">
                        <span>Show All Brands</span>
                        <FaArrowRight
                         className="w-4 h-4 transform -rotate-45" />
                    </a>
                </div>
            </div>
        </div>
    );
}
