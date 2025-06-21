import { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import { FaChevronRight, FaToggleOn } from 'react-icons/fa';
import { setCart } from "../../app/store/cartSlice";
import { FaBars, FaUser } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MobileSidebar = ({ isOpen, onClose, categories, subcategories, cartItems, authToken, handleSignOut }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const sidebarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 rounded-r-lg overflow-hidden`}
      >
        <div className="flex items-center justify-between p-5 bg-gray-100 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-screen">
          <nav className="space-y-4">
            <Link href="/" onClick={onClose} className="block text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>

            {/* Categories Dropdown */}
            <div>
              <button
                onClick={() => setSelectedCategory((prev) => (prev ? null : "categories"))}
                className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 font-medium"
              >
                Categories
                <FaChevronRight className={`${selectedCategory ? "rotate-90" : ""} transition-transform`} />
              </button>
              <div className="pl-4 mt-2 space-y-2">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => setSelectedCategory((prev) => (prev === category.id ? null : category.id))}
                      className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600"
                    >
                      {category.name}
                      <FaChevronRight className={`${selectedCategory === category.id ? "rotate-90" : ""} transition-transform`} />
                    </button>

                    {selectedCategory === category.id && (
                      <ul className="pl-4 mt-2 space-y-2 text-gray-600">
                        {subcategories
                          .filter((sub) => sub.categoryId === category.id)
                          .map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/filteredproducts?name=${sub.name}&slug=${sub.slug}`}
                                onClick={onClose}
                                className="block hover:text-blue-600"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Links */}
            <Link href="/pages/aboutus" onClick={onClose} className="block text-gray-700 hover:text-blue-600 font-medium">
              About Us
            </Link>
            <Link href="/pages/faq" onClick={onClose} className="block text-gray-700 hover:text-blue-600 font-medium">
              FAQ's
            </Link>
            <Link href="/pages/contactus" onClick={onClose} className="block text-gray-700 hover:text-blue-600 font-medium">
              Contact Us
            </Link>
          </nav>

          {/* Cart and Authentication Links */}
          <div className="mt-6 border-t pt-4">
            <Link href="/cart" onClick={onClose} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
              <MdOutlineShoppingCart size={24} className="mr-2" />
              Cart ({cartItems.length})
            </Link>
            {authToken ? (
              <button onClick={handleSignOut} className="flex items-center text-gray-700 hover:text-blue-600 mt-4 font-medium">
                <FiUser size={24} className="mr-2" />
                Sign Out
              </button>
            ) : (
              <Link href="/login" onClick={onClose} className="flex items-center text-gray-700 hover:text-blue-600 mt-4 font-medium">
                <FiUser size={24} className="mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>


  );
};

const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    checkDeviceType(); // Initial check

    window.addEventListener("resize", checkDeviceType); // Add resize listener
    return () => window.removeEventListener("resize", checkDeviceType); // Cleanup listener
  }, []);

  return isMobile ? "Mobile" : "Desktop";
};
const Header = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const deviceType = useDeviceType();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const modeldropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isModelsOpen, setModelsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const profileDropdownRef = useRef(null);
  const profileButtonRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [models, setmodels] = useState([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.data);
        const response2 = await fetch('/api/model');
        const data2 = await response2.json();
        setmodels(data2);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }

    async function fetchSubcategories() {
      try {
        const response = await fetch('/api/subcategories');
        const data = await response.json();
        setSubcategories(data.data);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      }
    }


    fetchCategories();
    fetchSubcategories();
  }, []);

  //-----------new code------------
  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };
  useEffect(() => {

    const token = sessionStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch(setCart(storedCart));

  }, [dispatch]);


  //-------------new code ends--------



  const filteredSubcategories = subcategories.filter(
    (subcategory) => subcategory.categoryId === selectedCategory
  );

  useEffect(() => {
    function handleClickOutside(event) {
           if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setCategoryOpen(false);
        setSelectedCategory(null); 
      }

      
      if (
        modeldropdownRef.current &&
        !modeldropdownRef.current.contains(event.target)
      ) {
        setModelsOpen(false);
      }

   
      if (
        profileDropdownRef.current &&
        profileButtonRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoryDropdownRef, modeldropdownRef, profileDropdownRef, profileButtonRef]);


  const handleSubcategoryClick = (subcategory) => {
    const url = `/filteredproducts?name=${subcategory.name}&slug=${subcategory.slug}`;
    window.location.href = url;
  };

  const toggleCategoryDropdown = () => {
    setCategoryOpen(!isCategoryOpen);
  };

  const toggleModelsDropdown = () => {
    setModelsOpen(!isModelsOpen);
  };
  // const [model, setmodel]=useState('');
  const searchmodel = (model) => {
    const query = new URLSearchParams({
      model: model
    }).toString();
    router.push(`/product/search?${query}`);
  };

  return (
    <>
      {deviceType === "Desktop" ? (

        <header className="flex h-[75px] borber-b items-center justify-between px-4 py-4 bg-white border-b">
          {/* Left Section: Category Button */}
          <div className="w-[40%] flex space-x-3">
            <button
              onClick={toggleCategoryDropdown}
              className="flex items-center bg-[#ff0000] text-[12px] text-white px-1 py-1"
            >
              <FaBars className="mr-2" />
              Category
            </button>
            {isCategoryOpen && (
              <div ref={categoryDropdownRef} className="absolute w-60 top-24 mt-2 bg-white border shadow-lg z-20">
                {/* <div className="flex items-center p-3 bg-[#FF0000] text-white">
                  <FaBars className="mr-2" />
                  <p className="text-center font-semibold">Categories</p>
                </div> */}
                <ul className="space-y-1">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      onMouseEnter={() => setSelectedCategory(category.id)}
                      onMouseLeave={() => setSelectedCategory(null)}
                      className={`relative flex items-center space-x-3 justify-between p-2 cursor-pointer hover:bg-gray-100 hover:text-gray-900 ${selectedCategory === category.id ? 'bg-[#FF0000] text-white' : ''
                        }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <FaChevronRight />

                      {/* Subcategories Dropdown */}
                      {selectedCategory === category.id && filteredSubcategories.length > 0 && (
                        <div
                          ref={dropdownRef}
                          className="absolute top-0 left-56 w-48 bg-white shadow-lg border p-2 z-10"
                        >
                          <ul>
                            {filteredSubcategories.map((subcategory) => (
                              <li
                                key={subcategory.id}
                                onClick={() => handleSubcategoryClick(subcategory)}
                                className="p-2 hover:bg-gray-100 hover:text-gray-900 text-black cursor-pointer"
                              >
                                {subcategory.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

              </div>
            )}
            <nav className="flex items-center space-x-5 text-[15px]">
              <a href="/" className="text-gray-700 hover:text-[#ff0000]">Home</a>
              <div className="relative">
                <button
                  onClick={toggleModelsDropdown}
                  className="text-gray-700 hover:text-[#ff0000] flex justify-center items-center space-x-2"
                >
                  Models
                  <IoMdArrowDropdown />
                </button>
                {isModelsOpen && (
                  <div ref={modeldropdownRef} className="absolute top-full mt-2 bg-white border shadow-lg z-10 w-auto">
                    <ul className="p-2 grid grid-flow-col auto-cols-max grid-rows-6 gap-2">
                      {models.map((model, index) => (

                        <li
                          key={model.id}
                          onClick={() => searchmodel(model.id)}
                          className={`p-2 hover:bg-gray-100 hover:text-gray-900 text-black cursor-pointer ${(index + 1) % 6 === 0 ? '' : 'border-r' // Adds border to all but the last item in each column
                            }`}
                          style={{
                            borderColor: '#ccc', // Set border color for column separation
                          }}
                        >
                          {model.model}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
              <a href="/pages/aboutus" className="text-gray-700 hover:text-[#ff0000]">About Us</a>
              <a href="/pages/faq" className="text-gray-700 hover:text-[#ff0000]">FAQ's</a>
              <a href="/pages/contactus" className="text-gray-700 hover:text-[#ff0000]">Contact Us</a>
            </nav>
          </div>

          <div className="w-[30%] flex justify-center">
            <a href="/">
              <img src="/images/autsparepartlogo.png" className="h-16 s"></img>
            </a>
            {/* <h1 className="text-[35px] font-bold font-sans text-[#ff0000]">
          Auto <span className="text-black">Spare </span>Parts
        </h1> */}
          </div>

          <div className="flex items-center justify-end space-x-10 w-[40%]">
            <div className="relative flex">
              <Link href="/cart">
                <MdOutlineShoppingCart className="mr-2 w-[45px] h-[39px] hover:text-blue-500 transition-colors duration-300" />
                {/* <FiShoppingCart className="text-gray-700 cursor-pointer hover:text-blue-500 transition-colors duration-300" /> */}
                {cartItems.length > 0 && (
                  <span className="absolute top-[-10px] right-[-5px] bg-[#FF0000] text-white rounded-full flex justify-center items-center w-6 h-6 text-[14px] font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>

            {authToken ? (
              <div className="relative flex space-x-8 justify-center items-center">
                <div className="flex items-center text-gray-700">
                  {/* <MdOutlineShoppingCart className="mr-2 w-[45px] h-[39px]" /> */}
                  {/* <div className="flex flex-col">
            <span className="text-[15px]">Shopping Cart</span>
            <span className="font-bold text-black text-[20px]">Rs. 21,000</span>
          </div> */}
                </div>
                <div ref={profileButtonRef}>
                  <FiUser
                    className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-500 transition-colors"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  />
                </div>

                {/* Dropdown for profile options */}
                {isDropdownOpen && (
                  <div
                    ref={profileDropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg p-2 z-50"
                  >
                    <Link
                      href="/myorders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/myprofile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* <button className="flex items-center text-gray-700">
              <FaUser className="mr-2" />
              Signup
            </button> */}
                <a href="/login">
                  <button className="bg-[#ff0000] text-white px-4 py-2 rounded-md">Login</button>
                </a>
              </>
            )}
          </div>
          {isSignOutModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
                <p>Are you sure you want to sign out?</p>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    onClick={() => setIsSignOutModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-[#FF0000] text-white rounded-md hover:bg-[#FF0000]"
                    onClick={() => {
                      sessionStorage.removeItem('authToken');
                      setAuthToken(null);
                      setIsSignOutModalOpen(false);
                      router.push('/');
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>
      ) : (<>
        <header className="relative">
          <div className="border-b mb-1 w-full z-50 h-12  bg-white flex justify-between px-3 py-1">
            <div className="flex">
              <Link href='/'>
                <img src="/images/autsparepartlogo.png" className="w-full h-full"></img>
              </Link>
            </div>
            <div className="flex justify-center items-center ">
              <button onClick={() => { setMobileSidebarOpen(true) }}>
                <FaBars />
              </button>

            </div>

          </div>
        </header>
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          categories={categories}
          subcategories={subcategories}
          cartItems={cartItems}
          authToken={authToken}
          handleSignOut={handleSignOut}
        />
      </>)}
    </>
  );
};

export default Header;
