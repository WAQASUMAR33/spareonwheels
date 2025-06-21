'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addToCart, setCart } from '../../../../store/cartSlice';
import { ThreeDots } from 'react-loader-spinner';
import Modal from 'react-modal';
import { FaTruck, FaUndo } from 'react-icons/fa';
import Link from 'next/link';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
const ProductPage = ({ productData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(productData.product);
  const [relatedProducts, setRelatedProducts] = useState(productData.relatedProducts || []);
  const [reviews, setReviews] = useState([]);
  const [cart, setCartState] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [selectedSize, setSelectedSize] = useState(null);
  // const [selectedColor, setSelectedColor] = useState(null);
  // const [sizes, setSizes] = useState([]);
  // const [colors, setColors] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const thumbnailRef = useRef(null);

  const scrollAmount = 100;

  const handleNext = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };
  const [brand, setBrand] = useState('');
  const [model, setmodel] = useState('');
  // Fetch product details and related products
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // setLoading(true); 
        const response = await axios.get(`/api/products/${product.slug}`);
        const { product: fetchedProduct, relatedProducts } = response.data.data;

        // setSizes(JSON.parse(fetchedProduct.sizes || '[]'));
        // setColors(JSON.parse(fetchedProduct.colors || '[]'));
        setProduct(fetchedProduct);
        setRelatedProducts(relatedProducts);
        const response2 = await axios.get(`/api/make/${product.makeId}`);
        const data2 = response2;
        const newbrand = data2.data;
        console.log("data2 ", data2, "New brand", newbrand);
        setBrand(newbrand.make)
        const response3 = await axios.get(`/api/model/${product.modelId}`);
        const data3 = response3;
        const newmodel = data3.data;
        console.log("data3 ", data3, "New model", newmodel);
        setmodel(newmodel.model)
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    if (product.slug) {
      fetchProduct();
    }
  }, [product.slug]);


  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/getreviews?productId=${product.id}`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (product.id) {
      fetchReviews();
    }
  }, [product.id]);

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('userName'); // Fetch the username from localStorage

    if (!username) {
      // If user is not authenticated, redirect to login page
      toast.error('You must be logged in to submit a review.');
      router.push('/login'); // Redirect to login page
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please provide a valid rating between 1 and 5.');
      return;
    }

    try {
      setReviewLoading(true);
      const response = await axios.post('/api/reviews', {
        productId: product.id,
        reviewer: username, // Use the username from localStorage
        rating,
        comment,
      });

      if (response.data.status === 201) {
        toast.success('Your review has been submitted.');
        setRating(0);
        setComment('');
      } else {
        toast.error('Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting your review.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Add product to cart
  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast.error(`You cannot add more than ${product.stock} of this item.`);
      return;
    }

    // if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
    //   toast.error('Please select a size and color.');
    //   return;
    // }

    const newCartItem = {
      id: 'default',
      // `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
      productId: product.id,
      quantity,
      price: product.discount
        ? calculateOriginalPrice(product.price, product.discount)
        : product.price,
      // selectedColor,
      // selectedSize,
      images: product.images,
      name: product.name,
      discount: product.discount,
    };

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === product.id 
      // &&
        // item.selectedSize === selectedSize &&
        // item.selectedColor === selectedColor
    );

    let updatedCart = [...cart];

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity,
      };
    } else {
      updatedCart.push(newCartItem);
    }

    setCartState(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch(setCart(updatedCart));

    toast.success('Item added to cart successfully!');
    setIsModalOpen(true);
  };

  // Utility function to calculate the original price after discount
  const calculateOriginalPrice = (price, discount) => {
    return price - price * (discount / 100);
  };

  // Utility function to get the image URL
  const getImageUrl = (url) => {
    return `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${url}`;
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div>
            <div
            className="text-gray-500 mb-4"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
          </div>
        );
      case 'additionalInfo':
        return (
          <div>
            <p>Here is the additional information about the product.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Material: Iron and PP</li>
              <li>Warranty: 2 years</li>
              <li>Country of Manufacture: Thailand</li>
              {/* Add more details as needed */}
            </ul>
          </div>
        );
      case 'reviews':
        return (
          <div>
           <div className="mt-8">
            <h3 className="text-lg md:text-2xl font-semibold mb-6">Customer Reviews</h3>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-6 flex flex-col border border-gray-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center bg-gray-200 rounded-full h-12 w-12 text-lg font-bold">
                        {review.reviewer.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">{review.reviewer}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {Array(review.rating)
                        .fill()
                        .map((_, i) => (
                          <span key={i} className="text-yellow-500">
                            &#9733;
                          </span>
                        ))}
                      {Array(5 - review.rating)
                        .fill()
                        .map((_, i) => (
                          <span key={i} className="text-gray-300">
                            &#9733;
                          </span>
                        ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
            )}


            <div className="mt-8">
              <h3 className="text-base md:text-lg font-semibold mb-4">Leave a Review</h3>

              {/* Check if user is logged in */}
              {localStorage.getItem('userName') ? (
                <form onSubmit={handleReviewSubmit}>
                   <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                Rating
            </label>
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer text-2xl ${
                            star <= rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                        aria-label={`${star} Star`}
                    />
                ))}
            </div>
            </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="4"
                      placeholder="Write your review..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                // Show this statement if the user is not logged in
                <p className="text-gray-500">
                  If you want to leave a review, please <a href="/login" className="text-blue-500">log in</a>.
                </p>
              )}
            </div>

          </div>
          </div>
        );
      default:
        return null;
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots height="80" width="80" radius="9" color="#3498db" ariaLabel="three-dots-loading" visible={true} />
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 pt-8">
      <ToastContainer />
      {isNavigating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#3498db"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      )}
      <div className="flex flex-wrap md:flex-nowrap min-h-screen md:space-x-8">
        {/* Product Images and Details */}
        <div className="w-full lg:w-3/5 mb-0 flex flex-col lg:flex-row h-full">
          <div className="flex flex-col lg:flex-col w-full">
            {/* Image Thumbnails */}

            {/* Main Image */}
            <div className="relative w-full pl-4">
              {product.images && product.images.length > 0 ? (
                <motion.img
                  key={currentImageIndex}
                  src={getImageUrl(product.images[currentImageIndex].url)}
                  alt={product.name}
                  className="md:w-auto w-[400px] h-[400px] object-contain mb-4 cursor-pointer"
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              ) : (
                <div className="h-48 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="relative flex items-center w-[600px] mx-auto">
              {/* Previous Button */}
              <button
                className="absolute left-0 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-200"
                onClick={handlePrev}
              >
                <FiChevronLeft size={24} />
              </button>

              {/* Thumbnails */}
              <div
                className="flex gap-4 items-center overflow-hidden px-10 "
                ref={thumbnailRef}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {product.images &&
                  product.images.map((image, index) => (
                    <div className='border-[1px] border-black rounded'>
                      <img
                        key={index}
                        src={getImageUrl(image.url)}
                        alt={product.name}
                        className={`md:w-32 md:h-32 w-20 h-20 object-contain cursor-pointer ${index === currentImageIndex ? 'opacity-100' : 'opacity-50'
                          }`}
                        onClick={() => setCurrentImageIndex(index)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  ))}
              </div>

              {/* Next Button */}
              <button
                className="absolute right-0 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-200"
                onClick={handleNext}
              >
                <FiChevronRight size={24} />
              </button>
            </div>

          </div>
        </div>

        {/* Product Info and Add to Cart */}
        <div className="w-full lg:w-2/5 h-full flex flex-col space-y-4 md:space-y-6 mt-4 md:mt-0">
  {/* Product Name */}
  <h2 className="text-2xl font-bold md:mb-4">{product.name.toUpperCase()}</h2>

  {/* Pricing and Rating Section */}
  <div className="grid grid-cols-4 mb-6 space-x-4">
    <div>
      {product.discount ? (
        <div className="flex flex-col space-y-1">
          <span className="text-[#FF0000] font-bold text-xl">
            Rs.{formatPrice(calculateOriginalPrice(product.price, product.discount))}
          </span>
          <span className="text-green-500 text-lg line-through">
            Rs.{formatPrice(product.price)}
          </span>
        </div>
      ) : (
        <span className="text-[#FF0000] text-2xl">Rs.{formatPrice(product.price)}</span>
      )}
    </div>
    <div className="col-span-3">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex gap-1 justify-center items-center px-2 py-1 bg-yellow-100 rounded-full">
            <FaStar /> 4.9
          </div>
          <Link href='' className="rounded-full px-2 py-1 bg-black text-white flex gap-1">
            Review
          </Link>
        </div>
        <p className="text-sm text-gray-600">
          <span className="text-green-600">93%</span> of buyers have recommended this
        </p>
      </div>
    </div>
  </div>

  {/* Brand and Model Information */}
  <div className="grid grid-cols-4 mb-6">
    <div>
      <p className="text-lg font-semibold">Brand:</p>
      <p className="text-lg font-semibold">Model:</p>
    </div>
    <div className="col-span-3">
      <p className="text-lg">{brand && brand}</p>
      <p className="text-lg">{model && model}</p>
    </div>
  </div>

  {/* Stock Info */}
  <div className="mb-4">
    {product.stock === 0 ? (
      <p className="text-lg font-bold text-red-700">Out of Stock</p>
    ) : (
      <p className="text-lg font-bold text-green-700">In Stock</p>
    )}
  </div>

  {/* Quantity Selector */}
  <div className="flex gap-4 items-center mb-6">
    <div className="flex items-center border border-gray-300 rounded-full px-4 py-1 w-32">
      <button
        className="text-gray-700 px-2"
        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
        disabled={quantity <= 1}
      >
        <FiMinus />
      </button>
      <span className="mx-4">{quantity}</span>
      <button
        className="text-gray-700 px-2"
        onClick={() => setQuantity((prev) => prev + 1)}
      >
        <FiPlus />
      </button>
    </div>

    {/* Add to Cart Button */}
    <button
      className="bg-[#FF0000] text-white py-2 px-6 rounded-full"
      onClick={handleAddToCart}
      disabled={product.stock === 0}
    >
      Add to cart
    </button>
  </div>

  {/* Delivery Information */}
  <div className="border rounded-lg p-4 space-y-6">
    {/* Free Delivery Section */}
    <div className="flex items-start space-x-3">
      <FaTruck className="text-[#FF0000] w-5 h-5" />
      <div>
        <h3 className="font-bold text-black">Free Delivery</h3>
        <p className="text-sm text-gray-600">
          <a href="#" className="text-blue-600 underline">
            Enter your Postal code for Delivery Availability
          </a>
        </p>
      </div>
    </div>
    <hr />
    {/* Return Delivery Section */}
    <div className="flex items-start space-x-3">
      <FaUndo className="text-[#FF0000] w-5 h-5" />
      <div>
        <h3 className="font-bold text-black">Return Delivery</h3>
        <p className="text-sm text-gray-600">
          Free 30 days Delivery Return.{' '}
          <a href="#" className="text-blue-600 underline">
            Details
          </a>
        </p>
      </div>
    </div>
  </div>
</div>

      </div>

      <div className="border rounded-lg p-4">
      {/* Tab Buttons */}
      <div className="flex justify-center space-x-2 items-center text-xs md:text-base">
        <div>
        <button
          className={`md:py-6 md:px-16 px-2 py-2 mx-auto font-bold ${activeTab === 'description' ? 'bg-[#FF0000] text-white' : 'bg-black text-white'}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        </div>
        <div>
        <button
          className={`md:py-6 md:px-16 px-2 py-2 mx-auto font-bold ${activeTab === 'additionalInfo' ? 'bg-[#FF0000] text-white' : 'bg-black text-white'}`}
          onClick={() => setActiveTab('additionalInfo')}
        >
          Additional Information
        </button>
        </div>
        <div>
        <button
          className={`md:py-6 md:px-16 px-2 py-2 mx-auto font-bold ${activeTab === 'reviews' ? 'bg-[#FF0000] text-white' : 'bg-black text-white'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews 
        </button>
      </div>
      </div>

      {/* Content Area */}
      <div className="text-gray-700 text-xs md:text-base mt-8 px-4">
        {renderContent()}
      </div>
    </div>

      {/* Related Products Section */}
      <div className="mt-12 mb-8">
        <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
        <div className="rounded grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-1 sm:px-4 lg:px-0">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relatedProduct) => {
              const originalPrice = calculateOriginalPrice(
                relatedProduct.price,
                relatedProduct.discount
              );
              return (
                <div
                  key={relatedProduct.slug}
                  className="bg-white shadow-md rounded-sm cursor-pointer border border-gray-300 relative min-h-[320px] w-full"
                  onClick={() => router.push(`/product/${relatedProduct.slug}`)}
                >
                  {relatedProduct.discount && (
                    <div className="absolute z-40 top-0 left-0 bg-red-100 text-[#FF0000] font-normal text-sm px-1 py-0.5">
                      {relatedProduct.discount.toFixed(2)}% OFF
                    </div>
                  )}
                  <div className="relative overflow-hidden">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <motion.img
                        src={getImageUrl(relatedProduct.images[0].url)}
                        alt={relatedProduct.name}
                        className="h-[240px] w-full object-contain mb-4 rounded bg-white"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    ) : (
                      <div className="h-[240px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <button
                      className="absolute bottom-2 right-2 bg-teal-500 text-white h-8 w-8 flex justify-center items-center rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/product/${relatedProduct.slug}`);
                      }}
                    >
                      <span className="text-xl font-bold leading-none">+</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 px-2">
                    <div className="flex items-center">
                      {relatedProduct.discount ? (
                        <div className="flex items-center justify-center gap-3 flex-row-reverse">
                          <p className="text-md font-normal text-gray-700 line-through">
                            Rs.{formatPrice(relatedProduct.price)}
                          </p>
                          <p className="text-md font-bold text-red-700">
                            Rs.{formatPrice(originalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-gray-700">
                          Rs.{formatPrice(relatedProduct.price)}
                        </p>
                      )}
                    </div>
                  </div>
                  <h3
                    className=" pl-2 text-sm font-normal text-gray-800 overflow-hidden hover:underline hover:text-blue-400 cursor-pointer"
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      maxHeight: '3em',
                    }}
                    onClick={() => router.push(`/product/${relatedProduct.slug}`)}
                  >
                    {relatedProduct.name.toUpperCase()}
                  </h3>
                </div>
              );
            })
          ) : (
            <div className="text-center col-span-full py-8 text-gray-500">
              No related products available.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Related Products */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Related Products"
        style={{
          overlay: {
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            zIndex: 10001,
            margin: 'auto',
            width: 'fit-content',
            height: 'fit-content',
            padding: '20px',
            textAlign: 'center',
          },
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full">
            <h2 className="text-xl font-semibold mb-4">
              Products You May Be Interested In
            </h2>
            <button className="text-gray-500" onClick={handleCloseModal}>
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.slug}
                className="flex flex-col items-center w-32 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => {
                  router.push(`/product/${relatedProduct.slug}`);
                  setIsModalOpen(false);
                }}
              >
                <img
                  src={getImageUrl(relatedProduct.images[0]?.url || '')}
                  alt={relatedProduct.name}
                  className="w-32 h-32 object-cover mb-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
                <p
                  className="text-sm text-gray-800 truncate w-full"
                  title={relatedProduct.name}
                >
                  {relatedProduct.name}
                </p>
                <p className="text-sm text-[#FF0000]">
                  Rs.{formatPrice(relatedProduct.price)}
                </p>
              </div>
            ))}
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductPage;
