import Link from 'next/link';
import React from 'react';
import { AiOutlineHeart, AiFillStar } from 'react-icons/ai';

export default function NewArrivalCard({ image, name, price, rating, reviews, slug }) {
    // Convert rating to the nearest integer for whole stars
    const stars = Math.round(rating);

    return (
        <Link href={`/product/${slug}`}>
        <div className="border border-gray-300 shadow-md flex items-center space-x-4 relative">
            {/* Favorite Icon */}
            
            <div className="relative flex-shrink-0">
                <img 
                    src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${image}`} 
                    alt={name} 
                    className="w-28 h-28 rounded-md object-cover"
                />
                <AiOutlineHeart className="absolute top-0 right-1 text-gray-900 hover:text-[#FF0000] cursor-pointer" />

            </div>

            <div className='p-4 '>
                <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                <p className="text-gray-500 mb-2">Rs. {price}</p>
                <div className="flex items-center space-x-1">
                    {/* Render filled stars based on the rating */}
                    {Array.from({ length: 5 }, (_, index) => (
                        <AiFillStar 
                            key={index} 
                            className={index < stars ? "text-yellow-400" : "text-gray-300"} 
                        />
                    ))}
                    <span className="text-gray-500 text-sm">({reviews})</span>
                </div>
            </div>
        </div>
        </Link>
    );
}
