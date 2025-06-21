'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiMinus } from 'react-icons/fi';
import axios from 'axios';
import { FiUser, FiHome, FiMapPin, FiPhone, FiMail, FiCreditCard, FiCalendar, FiLock, FiTag } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
import { removeFromCart, updateQuantity, setCart } from '../../store/cartSlice';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { sendOrderConfirmation } from '@/app/util/sendOrderConfirmation';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const [shippingAddress, setShippingAddress] = useState({
    recipientName: '',
    streetAddress: '',
    apartmentSuite: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phoneNumber: '+92',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [smallDeliveryCharge, setsmallDeliveryCharge] = useState(0);
  const [mediumDeliveryCharge, setmediumDeliveryCharge] = useState(0);
  const [largeDeliveryCharge, setlargeDeliveryCharge] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [extraDeliveryCharge, setExtraDeliveryCharge] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    setCart(storedCart);
    setTotal(storedCart.reduce((acc, item) => {
      const discount = item.discount || 0; // Default to 0 if no discount
      const discountedPrice = item.price - (item.price * discount / 100);
      return acc + discountedPrice * (item.quantity || 1);
    }, 0));

    fetchSettings();

    if (paymentMethod === 'Cash on Delivery') {
      fetchExtraDeliveryCharge();
    }
  }, [paymentMethod]);

  const updatecartelement = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    setCart(storedCart);
    setTotal(storedCart.reduce((acc, item) => {
      const discount = item.discount || 0; // Default to 0 if no discount
      const discountedPrice = item.price - (item.price * discount / 100);
      return acc + discountedPrice * (item.quantity || 1);
    }, 0));

  }

  const validateForm = () => {
    // const { recipientName, streetAddress, city, state, zip, country, phoneNumber, email } = shippingAddress;
    const { streetAddress, city, country, phoneNumber, email } = shippingAddress;


    if (!streetAddress || !city || !country || !phoneNumber || !email) {
      toast.error('Please fill in all the required fields.');
      return false;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    const phoneRegex = /^\+92\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error('Please enter a valid phone number.');
      return false;
    }

    return true;
  };


  const fetchSettings = async () => {
    try {
      console.log("fetch setting is goiing to call: ");
      const response = await axios.get(`/api/settings/getSettings/1`);
      const { deliveryCharge, taxPercentage, extraDeliveryCharge,smallDeliveryCharge,mediumDeliveryCharge,largeDeliveryCharge } = response.data;
      console.log("Setting response data is: ", response.data);
      // setDeliveryCharge(deliveryCharge);
      setsmallDeliveryCharge(smallDeliveryCharge);
      setmediumDeliveryCharge(mediumDeliveryCharge);
      setlargeDeliveryCharge(largeDeliveryCharge);
      setTaxRate(taxPercentage / 100);
      setExtraDeliveryCharge(extraDeliveryCharge || 0);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchExtraDeliveryCharge = async () => {
    try {
      const response = await axios.get(`/api/settings/getSettings/1`);
      const { other1 } = response.data;
      setExtraDeliveryCharge(other1);
    } catch (error) {
      console.error('Error fetching extra delivery charge:', error);
      setExtraDeliveryCharge(0);
    }
  };

  const calculateTotal = () => {
    const subtotalAfterDiscount = total - discount;
    const tax = subtotalAfterDiscount * taxRate;
    const effectiveDeliveryCharge = deliveryCharge; // Now properly calculated
    const effectiveCodCharge = paymentMethod === 'Cash on Delivery' ? extraDeliveryCharge : 0;
  
    return subtotalAfterDiscount + tax + effectiveDeliveryCharge + effectiveCodCharge;
  };

  const calculateItemDeliveryCharge = (dtype) => {
    switch (dtype) {
      case 'Small':
        return smallDeliveryCharge;
      case 'Medium':
        return mediumDeliveryCharge;
      case 'Large':
        return largeDeliveryCharge;
      default:
        return 0; // No charge for unknown or unspecified types
    }
  };
  

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'Cash on Delivery') {
      fetchExtraDeliveryCharge();
    } else {
      setExtraDeliveryCharge(0);
    }
  };

  // Input validation handlers
  const handleNameChange = (e) => {
    const { value } = e.target;
    const lettersOnly = /^[A-Za-z\s]*$/; // Only letters and spaces
    if (lettersOnly.test(value)) {
      setShippingAddress(prevState => ({
        ...prevState,
        recipientName: value
      }));
    }
  };

  const handleApartmentSuiteChange = (e) => {
    const { value } = e.target;
    const digitsOnly = /^[0-9]*$/; // Only digits
    if (digitsOnly.test(value)) {
      setShippingAddress(prevState => ({
        ...prevState,
        apartmentSuite: value
      }));
    }
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    const lettersOnly = /^[A-Za-z\s]*$/; // Only letters and spaces
    if (lettersOnly.test(value)) {
      setShippingAddress(prevState => ({
        ...prevState,
        city: value
      }));
    }
  };

  const handleCountryChange = (e) => {
    const { value } = e.target;
    const lettersOnly = /^[A-Za-z\s]*$/; // Only letters and spaces
    if (lettersOnly.test(value)) {
      setShippingAddress(prevState => ({
        ...prevState,
        country: value
      }));
    }
  };

  const handlePostalCodeChange = (e) => {
    const { value } = e.target;
    const alphanumeric = /^[A-Za-z0-9]*$/; // Only letters and digits
    if (alphanumeric.test(value)) {
      setShippingAddress(prevState => ({
        ...prevState,
        zip: value
      }));
    }
  };

  const handlePhoneChange = (e) => {
    let { value } = e.target;
    if (!value.startsWith('+92')) {
      value = '+92' + value.replace(/^\+?92/, '');
    }

    const phoneRegex = /^\+92\d{0,10}$/; // +92 followed by up to 10 digits
    if (phoneRegex.test(value)) {
      setShippingAddress(prevState => ({
        ...prevState,
        phoneNumber: value
      }));
    }
  };

  const handleEmailBlur = (e) => {
    const { value } = e.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation

    if (value && !emailRegex.test(value)) {
      toast.error('Please enter a valid email address.');
      setShippingAddress(prevState => ({
        ...prevState,
        email: ''
      }));
    } else {
      setShippingAddress(prevState => ({
        ...prevState,
        email: value
      }));
    }
  };


  // Inside the handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation for state (only letters)
    if (name === 'state' || name === 'city' || name === 'country') {
      const lettersOnly = /^[A-Za-z\s]+$/;
      if (!lettersOnly.test(value)) {
        // toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} should only contain letters and spaces.`);
        return; // Prevent updating the state with invalid input
      }
    }

    // Validation for apartmentSuite (only digits)
    if (name === 'apartmentSuite') {
      const digitsOnly = /^\d+$/;
      if (!digitsOnly.test(value)) {
        // toast.error('Apartment/Suite Number should only contain digits.');
        return; // Prevent updating the state with invalid input
      }
    }

    // Validation for postal/ZIP code (only alphanumeric)
    if (name === 'zip') {
      const alphanumeric = /^[A-Za-z0-9]+$/;
      if (!alphanumeric.test(value)) {
        toast.error('Postal/ZIP Code should only contain letters and digits.');
        return; // Prevent updating the state with invalid input
      }
    }

    setShippingAddress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to fetch product name by product ID
  const fetchProductNameById = async (id) => {
    try {
      const response = await axios.get(`/api/products/productname/${id}`);
      if (response.data && response.data.name) {
        return response.data.name;
      } else {
        return 'Unknown Product';
      }
    } catch (error) {
      console.error('Error fetching product name:', error);
      return 'Unknown Product';
    }
  };



  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    let userId = null;
    let token = null;

    try {
      token = sessionStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          userId = decoded.id; // Get the user ID from the token
        } else {
          sessionStorage.removeItem('authToken');
          router.push('/login'); // Redirect to login if token is expired
          return;
        }
      }

      // Prepare order items (fetch product name for each item)
      const orderItems = await Promise.all(
        cart.map(async (item) => {
          const productName = await fetchProductNameById(item.id);
          return {
            productId: item.id,
            quantity: item.quantity,
            price: item.price - (item.price * item.discount / 100),
            product: { name: productName } // Use the fetched product name
          };
        })
      );

      console.log('Order Items:', orderItems); // Debug orderItems

      // Calculate effective charges
      const subtotalAfterDiscount = total - discount;
      const calculatedTax = subtotalAfterDiscount * taxRate;

      // Apply condition: If subtotal after discount > 5000, delivery charge is 0
      const effectiveDeliveryCharge = deliveryCharge;
      // subtotalAfterDiscount > 5000 ? 0 : deliveryCharge;

      // Apply COD charge only if payment method is 'Cash on Delivery'
      const effectiveCodCharge = paymentMethod === 'Cash on Delivery' ? extraDeliveryCharge : 0;

      // Calculate total
      const calculatedTotal = subtotalAfterDiscount + calculatedTax + effectiveDeliveryCharge + effectiveCodCharge;

      // Prepare order details
      const orderDetails = {
        userId,
        shippingAddress,
        paymentMethod,
        paymentInfo: paymentMethod === 'Credit Card' ? paymentInfo : null,
        items: orderItems, // Pass the correct items structure
        total: calculatedTotal,
        discount,
        tax: calculatedTax,
        netTotal: calculatedTotal,
        deliveryCharge: effectiveDeliveryCharge,
        extraDeliveryCharge: effectiveCodCharge,
        couponCode
      };

      console.log('Order Details:', orderDetails); // Debug orderDetails

      // Place the order with your backend
      const response = await axios.post('/api/orders', orderDetails, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // Include auth token if available
      });

      console.log('API Response:', response.data); // Log the response

      if (response.data.status) {
        setIsModalOpen(true);
        localStorage.removeItem('cart'); // Clear the cart from localStorage
        setCart([]); // Reset cart state

        // Send order confirmation email
        await sendOrderConfirmation(
          shippingAddress.email, // Email to send to
          shippingAddress.recipientName, // Customer's name
          response.data.data.id, // Use order ID from backend response
          calculatedTotal, // Total amount
          orderItems, // Ordered items
          shippingAddress, // Shipping address details
          effectiveDeliveryCharge, // Delivery charge
          effectiveCodCharge // Extra delivery charge for COD
        );

        toast.success('Order placed successfully!');
      } else {
        console.error('API Error:', response.data);
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error); // Log the error
      toast.error('Failed to place order. Please try again.');
    }
  };




  // Function to send order confirmation email
  const sendOrderConfirmation = async (email, name, orderId, total, items, address, deliveryCharge, extraDeliveryCharge) => {
    try {
      // Ensure items is an array
      if (!Array.isArray(items)) {
        throw new Error('Items is not an array');
      }

      // Structure the items array to match the expected format in the backend
      const formattedItems = items.map(item => ({
        product: {
          name: item.product?.name || 'Unknown Product', // Ensure the product name exists
        },
        quantity: item.quantity || 1,
        price: item.price || 0,
      }));

      // Send the request to the backend API
      const response = await axios.post('/api/sendOrderConfirmation', {
        email,
        name,
        orderId,
        total,
        product: formattedItems, // Correctly structure the items array as "product"
        address,
        deliveryCharge,
        extraDeliveryCharge,
      });

      toast.success('Order confirmation email sent successfully!');
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      toast.error('Failed to send order confirmation email.');
    }
  };




  // const sendOrderConfirmation = async (email, name, orderId, total, items, address) => {
  //   try {
  //     const response = await axios.post('/api/orders', {
  //       email,
  //       name,
  //       orderId,
  //       total,
  //       items,
  //       address,
  //     });
  //     toast.success('Order confirmation email sent successfully!');
  //   } catch (error) {
  //     console.error('Failed to send order confirmation email:', error);
  //     if (error.response && error.response.data) {
  //       console.error('Error details:', error.response.data);
  //     }
  //     toast.error('Failed to send order confirmation email.');
  //   }
  // };
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
      calculateTotal(cart);
    }
  }, [cart, deliveryCharge]);



  // Update item quantity in the cart
  const updateItemQuantity = (itemId, quantity) => {
    dispatch(updateQuantity({ id: itemId, quantity }));
    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: quantity } : item
    );
    calculateTotal(updatedCart);
    updatecartelement();
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart({ id: itemId }));
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    toast.success('Product removed from cart!');
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    setTotal(storedCart.reduce((acc, item) => {
      const discount = item.discount || 0; 
      const discountedPrice = item.price - (item.price * discount / 100);
      return acc + discountedPrice * (item.quantity || 1);
    }, 0));
  };

  const calculateDeliveryCharge = (cartItems) => {
    let largestType = null;
  
    cartItems.forEach(item => {
      if (
        largestType === null || 
        (largestType === 'Small' && (item.dtype === 'Medium' || item.dtype === 'Large')) || 
        (largestType === 'Medium' && item.dtype === 'Large')
      ) {
        largestType = item.dtype;
      }
    });
  
    // Assign delivery charge based on the largest dtype
    let deliveryCharge = 0;
    switch (largestType) {
      case 'Small':
        deliveryCharge = smallDeliveryCharge;
        break;
      case 'Medium':
        deliveryCharge = mediumDeliveryCharge;
        break;
      case 'Large':
        deliveryCharge = largeDeliveryCharge;
        break;
      default:
        break; 
    }
  
    return deliveryCharge;
  };
  
  
  useEffect(() => {
    const updatedDeliveryCharge = calculateDeliveryCharge(cart);
    console.log("Updated delivery charges are: ",updatedDeliveryCharge);
    setDeliveryCharge(updatedDeliveryCharge);
  }, [cart, smallDeliveryCharge, mediumDeliveryCharge, largeDeliveryCharge]);
  

  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post('/api/coupons/validate', { code: couponCode });
      const data = response.data;

      if (data.valid) {
        const discountAmount = (total * data.discountPercentage) / 100;
        setDiscount(discountAmount);
        setCouponMessage(`Coupon applied! You get a discount of ${data.discountPercentage}% (Rs.${discountAmount.toFixed(2)})`);
      } else {
        setDiscount(0);
        setCouponMessage(data.message);
      }
    } catch (error) {
      setDiscount(0);
      setCouponMessage('Failed to validate coupon');
    }
  };

  return (
    <div className="container text-black bg-white mx-auto px-4 py-8">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 p-4 pt-2 gap-4">
  {cart.map((item, index) => {
    const itemDeliveryCharge = calculateItemDeliveryCharge(item.dtype);
    return (
      <div key={index} className="bg-white w-full flex flex-row p-4 border border-gray-300 rounded-lg shadow-md">
        
        {/* Image Section */}
        <div className="flex-shrink-0 mr-4">
          {item.images && item.images.length > 0 ? (
            <img
              src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${item.images[0].url}`}
              alt={item.name}
              className="h-40 w-40 object-cover rounded"
            />
          ) : (
            <div className="h-40 w-40 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Item Content Section */}
        <div className="flex flex-col justify-between w-full">
          <div className="mb-0">
            <h3 className="text-xl text-gray-600 font-semibold">{item.name.toUpperCase()}</h3>
            <p className="text-md font-bold text-black">
              Rs.{(item.price - (item.price * (item.discount || 0) / 100)).toLocaleString()}
            </p>
            {item.discount > 0 && (
              <p className="text-sm text-gray-500 line-through">Rs.{item.price.toLocaleString()}</p>
            )}
          </div>

          {/* Quantity & Remove Section */}
          <div className="flex items-center justify-between mb-0">
            <button
              className="text-sm text-red-500 underline"
              onClick={() => handleRemoveFromCart(item.id)}
            >
              Remove
            </button>
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-1">
              <button
                className="text-gray-700 md:px-2"
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <FiMinus />
              </button>
              <span className="md:mx-4 mx-2">{item.quantity}</span>
              <button
                className="text-gray-700 md:px-2"
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Total Price & Delivery Charge */}
          <div className="text-left mb-2">
            <p className="md:text-base text-xs text-black">
              Total: Rs.{(item.price - (item.price * (item.discount || 0) / 100)) * item.quantity}
            </p>
            {/* <p className="md:text-base text-xs text-black">
              Delivery Charge: Rs.{itemDeliveryCharge.toFixed(2)}
            </p> */}
          </div>
        </div>
      </div>
    );
  })}
</div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border p-4 h-[600px]">
            <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
            <div className="mb-4 relative">
              <FiUser className="absolute left-3 top-3 text-gray-500 font-bold" />
              <input
                type="text"
                placeholder="Recipient Name"
                name="recipientName"
                value={shippingAddress.recipientName}
                onChange={handleNameChange}
                className="w-full pl-10 px-4 py-2 border rounded-md"

              />
            </div>
            <div className="mb-4 relative">
              <FiHome className="absolute left-3 top-3 text-gray-500 font-bold" />
              <input
                type="text"
                placeholder="Street Address"
                name="streetAddress"
                value={shippingAddress.streetAddress}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4 relative">
              <FiHome className="absolute left-3 top-3 text-gray-500 font-bold" />
              <input
                type="text"
                placeholder="Apartment/Suite Number"
                name="apartmentSuite"
                value={shippingAddress.apartmentSuite}
                onChange={handleApartmentSuiteChange}
                className="w-full pl-10 px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4 relative">
              <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
              <input
                type="text"
                placeholder="City"
                name="city"
                value={shippingAddress.city}
                onChange={handleCityChange}
                className="w-full pl-10 px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4 relative">
              <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
              <input
                type="text"
                placeholder="State/Province/Region"
                name="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-2 border rounded-md"

              />
            </div>
            <div className="mb-4 relative">
              <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
              <input
                type="text"
                placeholder="Postal/ZIP Code"
                name="zip"
                value={shippingAddress.zip}
                onChange={handlePostalCodeChange}
                className="w-full pl-10 px-4 py-2 border rounded-md"

              />
            </div>
            <div className="mb-4 relative">
              <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
              <input
                type="text"
                placeholder="Country"
                name="country"
                value={shippingAddress.country}
                onChange={handleCountryChange}
                className="w-full pl-10 px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4 relative">
              <FiPhone className="absolute left-3 top-3 text-gray-500 font-bold" />
              <input
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                value={shippingAddress.phoneNumber}
                onChange={handlePhoneChange}
                className="w-full pl-10 px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4 relative">
              <FiMail className="absolute left-3 top-3 text-gray-500 font-bold" />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                onBlur={handleEmailBlur}
                value={shippingAddress.email}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="border p-4">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="text-md font-medium text-gray-700">Subtotal:</p>
                <p className="text-xl text-gray-700">Rs.{total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-md font-medium text-gray-700">Coupon Discount ({total > 0 ? ((discount / total) * 100).toFixed(2) : 0}%):</p>
                <p className="text-md text-gray-700">- Rs.{discount.toFixed(2)}</p>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <p className="text-md font-medium text-gray-700">Subtotal after Discount:</p>
                <p className="text-md text-gray-700">Rs.{(total - discount).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-md font-medium text-gray-700">Tax ({(taxRate * 100).toFixed(2)}%):</p>
                <p className="text-md text-gray-700">Rs.{((total - discount) * taxRate).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-md font-medium text-gray-700">Delivery Charges:</p>
                <p className="text-md text-gray-700">Rs.{deliveryCharge.toFixed(2)}</p>

              </div>
              {paymentMethod === 'Cash on Delivery' && (
                <div className="flex justify-between">
                  <p className="text-md font-medium text-gray-700">Cash On Delivery Charges:</p>
                  <p className="text-md text-gray-700">Rs.{extraDeliveryCharge.toFixed(2)}</p>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between">
                <p className="text-xl font-bold text-gray-700">Total:</p>
                <p className="text-xl text-gray-700">Rs.{calculateTotal().toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Coupon Code</h2>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md pr-10"
                />
                <FiTag className="absolute right-3 text-gray-500 font-bold" />
              </div>
              <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 w-full" onClick={handleApplyCoupon}>

                Apply Coupon
              </button>
              {couponMessage && (
                <p className="text-green-500 mt-2">{couponMessage}</p>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <label htmlFor="creditCard" className="ml-2">Credit Card</label>
              </div>
              {paymentMethod === 'Credit Card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="mb-4 relative flex items-center">
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md pr-10"
                      required
                    />
                    <FiCreditCard className="absolute right-3 text-gray-500 font-bold" />
                  </div>
                  <div className="mb-4 relative flex items-center">
                    <input
                      type="text"
                      placeholder="Card Name"
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md pr-10"
                      required
                    />
                    <FiUser className="absolute right-3 text-gray-500 font-bold" />
                  </div>
                  <div className="mb-4 relative flex items-center">
                    <input
                      type="text"
                      placeholder="Expiry Date"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md pr-10"
                      required
                    />
                    <FiCalendar className="absolute right-3 text-gray-500 font-bold" />
                  </div>
                  <div className="mb-4 relative flex items-center">
                    <input
                      type="text"
                      placeholder="CVV"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md pr-10"
                      required
                    />
                    <FiLock className="absolute right-3 text-gray-500 font-bold" />
                  </div>
                </div>
              )}
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <label htmlFor="cod" className="ml-2">Cash on Delivery</label>
              </div>
            </div>



            <button className="bg-teal-500 text-white py-2 px-4 rounded-md mt-8 w-full" type="submit">
              Place Order
            </button>
          </div>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Order Success"
        style={{
          overlay: {
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            zIndex: 10001,
            margin: 'auto',
            width: 'fit-content',
            height: 'fit-content',
            padding: '20px',
            textAlign: 'center'
          }
        }}
      >
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-12 h-12 text-green-500 mb-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7-1a9 9 0 11-6-8.71" />
          </svg>
          <h2 className="text-xl font-semibold mb-4">Order Placed Successfully!</h2>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={() => {
              setIsModalOpen(false);
              router.push('/');
            }}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
