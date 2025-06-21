import React from 'react';
import NewArrivalCard from './NewArrivalCard';
import { useState,useEffect } from 'react';
import axios from 'axios';

export default function NewArrival() {
    // Extend the product list to have 9 items by repeating existing products
    const [newarrival, setnewarrival] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products/newArrivals');

                console.log("TOP RADET Products are: ", response.data.data);
                setnewarrival(response.data.data); // Assuming the API returns products in `data.data`
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);
    const calculateDiscountedPrice = (price, discount) => {
        if (!price || !discount) return price; // If no discount, return original price
        return price - (price * discount) / 100;
    };
    return (
        <div className="w-full h-auto flex flex-col items-start px-4 md:px-12 py-4 md:py-8">
            <h1 className="text-3xl font-semibold mb-6">New Arrivals</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-6">
                {newarrival.map((product) => (
                    <NewArrivalCard 
                        key={product.id} 
                        image={product.images[0].url} 
                        name={product.name} 
                        price={calculateDiscountedPrice(product.price, product.discount).toLocaleString()}
                        rating={4.5}  // You can replace with actual rating if available
                        reviews={88}  // Replace with actual review count if available
                        slug={product.slug}
                    />
                ))}
            </div>
        </div>
    );
}
