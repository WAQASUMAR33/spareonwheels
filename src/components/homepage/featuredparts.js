import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const FeatureParts = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products/featuredproducts');

                console.log("TOP RADET Products are: ", response.data.data);
                setProducts(response.data.data); // Assuming the API returns products in `data.data`
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
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-left mb-12">Feature Parts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {products.map(product => (
                    <Link href={`/product/${product.slug}`}>
                    <div key={product.id} className="border border-gray-500/50 hover:border-red-600 p-2 md:p-4 text-left transition-all transform hover:scale-[1.02] duration-300 bg-white rounded-lg w-full md:h-80 h-52 flex flex-col justify-between">
                        <img src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${product.images[0].url}`} alt={product.name} className="h-32 w-32 md:w-full md:min-w-60 md:min-h-60 md:max-h-60 mx-auto object-cover" />
                        <div>
                            <h3 className="text-sm md:text-lg font-semibold">{product.name}</h3>
                            {/* <p
                                className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-1"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            /> */}

                            <p className="text-black text-sm md:text-xl font-bold flex  gap-1">
                                Rs {calculateDiscountedPrice(product.price, product.discount).toLocaleString()}
                                {/* <br /> */}
                                <span className="text-blue-900 line-through">{product.price.toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FeatureParts;
