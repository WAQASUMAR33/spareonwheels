'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThreeDots } from 'react-loader-spinner';
import { FaArrowRight } from "react-icons/fa";
import { motion } from 'framer-motion';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch search parameters from URL
  const searchtext = searchParams.get('searchtext') || 'Any';
  const make = searchParams.get('make') || 'Any';
  const model = searchParams.get('model') || 'Any';
  const year = searchParams.get('year') || 'Any';
  const type = searchParams.get('type') || 'Any';

  // Fetch products based on search parameters
  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.post('/api/products/search', {
        searchtext,
        make,
        model,
        year,
        type,
      });

      const fetchedProducts = response.data.data;
      setProducts(fetchedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  }, [searchtext, make, model, year, type]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductClick = (slug) => {
    router.push(`/product/${slug}`);
  };

  const calculateOriginalPrice = (price, discount) => {
    return price - price * (discount / 100);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots height="80" width="80" radius="9" color="#3498db" ariaLabel="three-dots-loading" visible={true} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((product) => {
            const originalPrice = calculateOriginalPrice(product.price, product.discount);
            return (
              <div
                key={product.id}
                style={{ height: "320px" }}
                className="bg-white text-[12px] rounded-lg shadow-md border border-gray-300 p-4 flex flex-col flex-shrink-0 cursor-pointer transform transition-transform duration-300 hover:-translate-y-1"
                onClick={() => handleProductClick(product.slug)}
              >
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-[#FF0000] text-white font-semibold text-xs px-2 py-1 rounded-full shadow-md z-10">
                    {product.discount}% OFF
                  </div>
                )}

                {/* Product Image */}
                <div className="flex justify-center items-center bg-gray-100 rounded-md overflow-hidden mb-4">
                  {product.images && product.images.length > 0 ? (
                    <motion.img
                      src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${product.images[0]}`}
                      alt={product.name}
                      className="h-32 w-full object-cover transform transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="h-32 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="text-left flex-1 px-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name.toUpperCase()}</h3>
                  <p
                    className="text-gray-600 leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>

                {/* Price and Button */}
                <div className="flex justify-between items-center mt-2 border-t border-gray-200 pt-3">
                  <div className="text-[14px] font-bold text-gray-800">Rs {formatPrice(originalPrice)}</div>
                  <button className="text-[#FF0000] w-28 justify-center font-500 flex items-center hover:bg-[#FF0000] hover:text-white transition border p-2 border-[#FF0000] hover:border-white">
                    View Details <FaArrowRight className="ml-1 transform -rotate-45" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center col-span-full py-8 text-gray-500">
            No products found with the specified filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
