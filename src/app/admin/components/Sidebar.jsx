'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // for redirecting users
import {
  FaUsers,
  FaSignOutAlt,
  FaChevronDown,
  FaCube,
  FaShoppingCart,
  FaTags,
  FaPaintBrush,
  FaRuler,
  FaCogs,
  FaTicketAlt,
  FaImages,
  FaStar,
  FaBlog,
  FaHome,
  FaPhone,
  FaStore,
  FaBezierCurve
} from 'react-icons/fa';

const Sidebar = ({ setActiveComponent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    customers: false,
    products: false,
    orders: false,
    categories: false,
    size: false,
    color: false,
    settings: false,
    coupons: false,
    sliders: false,
    socialmedia: false,
    blog: false
  });


  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  // Check if the user role is in localStorage
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role); // Set role state based on localStorage
    } else {
      router.push('/login'); // Redirect to login if no role found
    }
  }, [router]);
  // Check if the user is authenticated
  // useEffect(() => {
  //   const token = Cookies.get('token') || localStorage.getItem('token');
  //   if (!token) {

  //     router.push('/admin');
  //   }
  // }, [router]);

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // Handle logout
  const handleLogout = () => {
    // Remove the token from cookies and localStorage
    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Redirect to the login page
    window.location.href = '/admin';
  };

  const [companyName, setcompanyName] = useState('');
  const [companyHeaderImage, setcompanyHeaderImage] = useState('');
  const [companyicon, setcompanyicon] = useState('');
  useEffect(() => {
    async function fetchCompanyDetails() {
      console.log("Fetching company details...");
      try {
        const response = await fetch('/api/companydetails');
        const data = await response.json();
        console.log("Fetched data:", data);
        if (data) {
          console.log("data is : ", data);
          setcompanyName(data.name);
          setcompanyHeaderImage(data.headerImage);
          setcompanyicon(data.favIcon);
          console.log("Company data is ", company);

        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    }
    fetchCompanyDetails();
  }, []);

  return (
    <div className="bg-gray-700 text-white flex flex-col text-sm" style={{ width: '250px', height: '100vh', overflowY: 'auto' }}>
      <div className="p-4 text-center">
        <img width={120} src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${companyHeaderImage}`} alt="Profile" className="rounded-full px-2 py-2 mx-auto mb-2 bg-white" />
        <h2 className="text-lg font-semibold">{companyName}</h2>
        <p className="text-green-400">● Online</p>
      </div>
      <div className="p-4 border-t border-gray-700 h-full overflow-auto">
        <ul className="mt-4 space-y-2">
          <li>
            <a href='/admin/pages/Main'>
              <button
                className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              >
                <FaHome className="h-5 w-5" />
                <span className="ml-2">Home</span>
              </button>
            </a>
          </li>
          {userRole === 'SUPERADMIN' && (
            <>
              <li>
                <a href='/admin/pages/superadminanalytics'>
                  <button
                    className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  >
                    <FaBezierCurve className="h-5 w-5" />
                    <span className="ml-2">Analytics</span>
                  </button>
                </a>
              </li>
              {/* <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('customers')}
                >
                  <FaUsers className="h-5 w-5" />
                  <span className="ml-2">Customers Data</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.customers && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/customer'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">Customers</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}
            </>
          )}
          {userRole==='ADMIN'&&(
            <>
             <li>
                {/* <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('customers')}
                >
                  <FaUsers className="h-5 w-5" />
                  <span className="ml-2">Customers Data</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button> */}
                {/* {isDropdownOpen.customers && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/customer'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">Customers</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )} */}
              </li></>
          )}
          {/* <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('customers')}
            >
              <FaUsers className="h-5 w-5" />
              <span className="ml-2">Admin</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.customers && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/customer'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Admin</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li> */}
          {userRole === 'INVENTORYMANAGER' && (
            <>
              <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('products')}
                >
                  <FaCube className="h-5 w-5" />
                  <span className="ml-2">Services</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.products && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/Products'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2 text-md">All Services</span>
                        </button>
                      </a>
                    </li>
                    <li>
                      <a href='/admin/pages/add-product'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">Add Service</span>
                        </button>
                      </a>
                    </li>
                   
                   
                   
                  </ul>
                )}
              </li>

             
              <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="h-5 w-5" />
                  <span className="ml-2">Logout</span>
                </button>
              </li>
            </>
          )}


          {(userRole === 'ADMIN' || userRole === 'SUPERADMIN' )&& (
            <>

              <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('products')}
                >
                  <FaCube className="h-5 w-5" />
                  <span className="ml-2">Services</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.products && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/Products'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2 text-md">All Services</span>
                        </button>
                      </a>
                    </li>
                    <li>
                      <a href='/admin/pages/add-product'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">Add New Service</span>
                        </button>
                      </a>
                    </li>
                  
                    
                  </ul>
                )}
              </li>

              {/* <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('orders')}
                >
                  <FaShoppingCart className="h-5 w-5" />
                  <span className="ml-2">Orders</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.orders && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/orders'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">View Orders</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}

              <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('categories')}
                >
                  <FaTags className="h-5 w-5" />
                  <span className="ml-2">Categories</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.categories && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/categories'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">Categories</span>
                        </button>
                      </a>
                    </li>
                    {/* <li>
                      <a href='/admin/pages/subcategories'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">SubCategory</span>
                        </button>
                      </a>
                    </li> */}
                  </ul>
                )}
              </li>

              {/* <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('size')}
            >
              <FaRuler className="h-5 w-5" />
              <span className="ml-2">Size</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.size && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/size'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Sizes</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('color')}
            >
              <FaPaintBrush className="h-5 w-5" />
              <span className="ml-2">Color</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.color && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/color'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Colors</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li> */}

              {/* <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('settings')}
                >
                  <FaCogs className="h-5 w-5" />
                  <span className="ml-2">Settings</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.settings && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/settings'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">Settings</span>
                        </button>
                      </a>
                    </li>
                    <li>
                      <a href='/admin/pages/facebook-pixel'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">Facebook Pixel</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}

              {/* <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('coupons')}
                >
                  <FaTicketAlt className="h-5 w-5" />
                  <span className="ml-2">Coupons</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.coupons && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/coupons'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">Coupons</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}

              {/* <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('sliders')} // Toggle for sliders
                >
                  <FaImages className="h-5 w-5" />
                  <span className="ml-2">Slider</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.sliders && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/slider'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">View Sliders</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}

              {/* <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('socialmedia')} // Toggle for social media
                >
                  <FaUsers className="h-5 w-5" />
                  <span className="ml-2">Social Media</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.socialmedia && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/socialmedia'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">Manage Social Media</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}

              {/* Blog Dropdown */}
              {/* <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={() => toggleDropdown('blog')} // Toggle for blog
            >
              <FaBlog className="h-5 w-5" />
              <span className="ml-2">Blog</span>
              <FaChevronDown className="h-3 w-3 ml-auto" />
            </button>
            {isDropdownOpen.blog && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <a href='/admin/pages/Blogs'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Add Blog</span>
                    </button>
                  </a>
                </li>
                <li>
                  <a href='/admin/pages/BlogCategory'>
                    <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                      <span className="ml-2">Blog Categories</span>
                    </button>
                  </a>
                </li>
              </ul>
            )}
          </li> */}

              {/* <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('reviews')}
                >
                  <FaStar className="h-5 w-5" />
                  <span className="ml-2">Customer Reviews</span>
                  <FaChevronDown className="h-3 w-3 ml-auto" />
                </button>
                {isDropdownOpen.reviews && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href='/admin/pages/reviews'>
                        <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">View Reviews</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li> */}
              {/* <li>
                <a href='/admin/pages/addContactInfo'>
                  <button
                    className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  >
                    <FaPhone className="h-5 w-5" />
                    <span className="ml-2">Contact Info</span>
                  </button>
                </a>
              </li>
              <li> */}
                {/* <a href='/admin/pages/CompanyDetails'>
                  <button
                    className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  >
                    <FaStore className="h-5 w-5" />
                    <span className="ml-2">Company Details</span>
                  </button>
                </a>
              </li> */}

              <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="h-5 w-5" />
                  <span className="ml-2">Logout</span>
                </button>
              </li>
            </>)}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
