import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Heart, ShoppingCart, ChevronRight, X, User, Link, ArrowDown, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../app/store/cartSlice';
import { useRouter } from 'next/navigation';
import { IoMdArrowDropdown } from 'react-icons/io';

const MobileSidebar = ({ isOpen, onClose, categories, subcategories }) => {

    const [selectedCategory, setSelectedCategory] = useState(null);
    const sidebarRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}>
            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 rounded-r-lg overflow-hidden`}
            >
                <div className="flex items-center justify-between p-5 bg-gray-100 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto max-h-screen">
                    <nav className="space-y-4">
                        {categories.map((category) => (
                            <div key={category.id}>
                                <button
                                    onClick={() => setSelectedCategory(prev => prev === category.id ? null : category.id)}
                                    className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600"
                                >
                                    {category.name}
                                    <ChevronRight className={`transform ${selectedCategory === category.id ? 'rotate-90' : ''} transition-transform`} />
                                </button>

                                {selectedCategory === category.id && (
                                    <div className="pl-4 mt-2 space-y-2">
                                        {subcategories
                                            .filter(sub => sub.categoryId === category.id)
                                            .map(sub => (
                                                <a
                                                    key={sub.id}
                                                    href={`/category/${sub.slug}`}
                                                    className="block text-gray-600 hover:text-blue-600"
                                                    onClick={onClose}
                                                >
                                                    {sub.name}
                                                </a>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

const NewHeader = ({image, phone, email}) => {
    
    const router = useRouter();
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isCategoryOpen, setCategoryOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const cartItems = useSelector((state) => state.cart.items);
    const modeldropdownRef = useRef(null);
    const [isModelsOpen, setModelsOpen] = useState(false);
    const categoryDropdownRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const profileButtonRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [models, setmodels] = useState([])


    const dispatch = useDispatch();
    const handleSignOut = () => {
        setIsSignOutModalOpen(true);
    };
    useEffect(() => {
        const checkDeviceType = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkDeviceType();
        window.addEventListener("resize", checkDeviceType);
        return () => window.removeEventListener("resize", checkDeviceType);
    }, []);

    useEffect(() => {
        // Simulated API calls - replace with your actual API endpoints
        const fetchCategories = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data.data || []);
                const response2 = await fetch('/api/model');
                const data2 = await response2.json();
                setmodels(data2);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setCategories([]);
            }
        };

        const fetchSubcategories = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/subcategories');
                const data = await response.json();
                setSubcategories(data.data || []);
            } catch (error) {
                console.error('Failed to fetch subcategories:', error);
                setSubcategories([]);
            }
        };

        fetchCategories();
        fetchSubcategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setCategoryOpen(false);
                setSelectedCategory(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubcategoryClick = (subcategory) => {
        const url = `/filteredproducts?name=${subcategory.name}&slug=${subcategory.slug}`;
        window.location.href = url;
    };

    useEffect(() => {

        const token = sessionStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
        }

        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        dispatch(setCart(storedCart));

    }, [dispatch]);


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
    const [searchText, setSearchText] = useState("");
   
    const handleSearch = () => {
        if (searchText.trim()) {
            router.push(`/product/search?searchtext=${encodeURIComponent(searchText)}`);
        }
    };
    return (
        <>
            {!isMobile ? (
                <header className="bg-white shadow-sm border-b-2">
                    <div className="container mx-auto px-4">
                        {/* Top Section */}
                        <div className="py-0 flex items-center justify-between">
                            {/* Logo and Category */}
                            <div className="flex items-center space-x-4">
                                <a href='/'>
                                {image?(<> <img
                                        src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${image}`}
                                        alt="Auto Spare Parts Logo"
                                        className="h-16"
                                    /></>):(<>
                                    <div className='h-16 flex justify-center items-center'>
                                    <Loader className='animate-spin-slow'/>
                                    </div>
                                    </>)}
                                   
                                </a>

                            </div>

                            {/* Search Bar */}
                            <div className="flex-1 max-w-2xl relative">
                                <input
                                 type="text"
                                 placeholder="Search Spare Parts"
                                 value={searchText}
                                 onChange={(e) => setSearchText(e.target.value)}
                                    className="w-full px-3 py-1 bg-gray-100 rounded-md outline-none ring-1 ring-gray-500 focus:ring-[#FF0000]"
                                />
                                <button  onClick={handleSearch} className="absolute -right-[1px] top-1/2 -translate-y-1/2 px-3 py-2  bg-[#FF0000] rounded-md hover:bg-[#FF0000]">
                                    <Search className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Contact Info */}


                            {/* Wish List and Cart */}
                            <div className="flex items-center space-x-6">
                                {/* <div className="flex items-center space-x-2">
                                    <Heart className="w-8 h-8 text-gray-600" />
                                    <div className="text-sm">
                                        <span className="block">Wish List</span>
                                    </div>
                                </div> */}

                                <a href="/cart" className="flex items-center space-x-2">

                                    <div className="relative">
                                        <ShoppingCart className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <div className='relative'>
                                        {cartItems.length > 0 && (
                                            <span className=" bg-[#FF0000] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                {cartItems.length}
                                            </span>
                                        )}
                                        <span className="block text-sm">Cart</span>
                                    </div>

                                </a>

                                {authToken ? (
                                    <div className="relative flex space-x-8 justify-center items-center">
                                        <div className="flex items-center text-gray-700">
                                        </div>
                                        <div ref={profileButtonRef}>
                                            <User
                                                className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-500 transition-colors"
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            />
                                        </div>

                                        {isDropdownOpen && (
                                            <div
                                                ref={profileDropdownRef}
                                                className="absolute right-0 top-full mt-2 w-48 bg-white border rounded shadow-lg p-2 z-50"
                                            >
                                                <a
                                                    href="/myorders"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                >
                                                    My Orders
                                                </a>
                                                <a
                                                    href="/myprofile"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                >
                                                    Profile
                                                </a>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                >
                                                    Sign Out
                                                </button>
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
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="bg-white border-t">
                        <div className="container mx-auto px-4 py-1 flex justify-between items-center">
                            <div className="relative">
                                <button
                                    onClick={() => setCategoryOpen(!isCategoryOpen)}
                                    className="flex items-center space-x-2 bg-[#FF0000] text-white px-4 py-2 rounded-md"
                                >
                                    <Menu className="w-5 h-5" />
                                    <span>Category</span>
                                </button>

                                {isCategoryOpen && (
                                    <div ref={categoryDropdownRef} className="absolute w-60 top-full mt-2 bg-white border shadow-lg z-20">
                                        <ul className="space-y-1">
                                            {categories.map((category) => (
                                                <li
                                                    key={category.id}
                                                    onMouseEnter={() => setSelectedCategory(category.id)}
                                                    className={`relative flex items-center justify-between p-2 cursor-pointer hover:bg-[#FF0000] ${selectedCategory === category.id ? 'bg-[#FF0000] text-white' : ''
                                                        }`}
                                                >
                                                    <span>{category.name}</span>
                                                    <ChevronRight size={16} />

                                                    {selectedCategory === category.id && (
                                                        <div className="absolute left-full top-0 w-48 bg-white text-gray-800 shadow-lg border ml-1">
                                                            <ul>
                                                                {subcategories
                                                                    .filter(sub => sub.categoryId === category.id)
                                                                    .map(subcategory => (
                                                                        <li
                                                                            key={subcategory.id}
                                                                            onClick={() => handleSubcategoryClick(subcategory)}
                                                                            className="p-2 hover:bg-[#FF0000] hover:text-white cursor-pointer"
                                                                        >
                                                                            {subcategory.name}
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div>
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
                            <div className="text-right text-sm text-gray-600 flex">
                                <p> <a href={`mailto:${email}`}>{email}</a></p>
                                <p className='mx-2'>|</p>
                                <p><a href={`tel:${phone}`}>{phone}</a></p>
                            </div>
                        </div>
                    </nav>
                </header>
            ) : (
                <>
                    <header className="bg-white shadow-sm">
                        <div className="flex items-center justify-between px-4 py-2">
                            <img
                                src="/images/autsparepartlogo.png"
                                alt="Auto Spare Parts Logo"
                                className="h-12"
                            />
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className="p-2"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </header>

                    <MobileSidebar
                        isOpen={isMobileSidebarOpen}
                        onClose={() => setMobileSidebarOpen(false)}
                        categories={categories}
                        subcategories={subcategories}
                    />
                </>
            )}
        </>
    );
};

export default NewHeader;