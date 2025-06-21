import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaApple, FaGooglePlay, FaArrowUp, FaPinterest, FaTiktok } from "react-icons/fa";
import { TicketCheckIcon } from "lucide-react";

export default function Footer() {
    const [brands, setBrands] = useState([]);


    const [subcategories, setSubcategories] = useState([]);
    const [socialmedia, setsocialmedia] = useState();
  useEffect(() => {

    async function fetchSubcategories() {
      try {
        const response2 = await fetch('/api/socialmedia/1');
        const data2 = await response2.json();
        setsocialmedia(data2.data);
        console.log("Datais ",data2.data);
        const response = await fetch('/api/categories');
        const data = await response.json();
        setSubcategories(data.data);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      }
    }

    fetchSubcategories();
  }, []);

    useEffect(() => {
        async function fetchBrands() {
            try {
                const response = await fetch('/api/make');
                const data = await response.json();
                setBrands(data); // Assuming the response is in the form { data: [...] }
            } catch (error) {
                console.error('Failed to fetch brands:', error);
            }
        }

        fetchBrands();
    }, []);

    return (
        <div className="bg-black text-white py-8 md:py-12 px-4 md:px-8">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Brand Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
                    <div>
                        <h1 className="text-2xl font-bold">Auto Parts</h1>
                        <p className="mt-2 text-gray-400">Receive pricing updates, shopping tips & more!</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex relative">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full h-12 md:h-16 bg-gray-800 text-white px-4 py-2 rounded-full outline-none"
                        />
                        <button className="absolute h-10 md:h-12 top-1 md:top-2 right-2 bg-[#FF0000] w-24 md:w-32 px-4 py-2 rounded-full font-semibold">Sign Up</button>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 mt-8 md:mt-16">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Company</h2>
                        <ul className="text-gray-400 space-y-2 text-sm md:text-base">
                            <Link href='/pages/aboutus'><li>About Us</li></Link>
                            {/* <Link href='/customer/pages/services'><li>Services</li></Link> */}
                            <Link href='/pages/privacypolicy'><li>Privacy Policy</li></Link>
                            <Link href='/pages/termsandconditions'><li>Terms & Conditions</li></Link>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
                        <ul className="text-gray-400 space-y-2 text-sm md:text-base">
                        <a href='/pages/contactus'><li>Get in Touch</li></a>
                        <a href='/pages/faq'><li>FAQs</li></a>
                            <Link href='/myorders'><li>Track your order</li></Link>
                            <Link href='/pages/shippingpolicy'><li>Shipping Policy</li></Link>
                            <Link href='/pages/returnandexchangepolicy'><li>Return & Exchange Policy</li></Link>
                            
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Our Brands</h2>
                        <ul className="text-gray-400 space-y-2 text-sm md:text-base">
                            {brands.length > 0 ? (
                                brands.map((brand) => (
                                    <Link href={`/filteredproducts?make=${brand.make}&id=${brand.id}`} key={brand.id}>
                                        <li>{brand.make}</li>
                                    </Link>
                                ))
                            ) : (
                                <li>Loading brands...</li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Categories</h2>
                        <ul className="text-gray-400 space-y-2 text-sm md:text-base">
                            {subcategories.length > 0 ? (
                                subcategories.map((subcategory) => (
                                    <Link href={`/category/${subcategory.name}`} key={subcategory.id}>
                                        <li>{subcategory.name}</li>
                                    </Link>
                                ))
                            ) : (
                                <li>Loading categories...</li>
                            )}
                        </ul>
                    </div>

                    {/* App Download and Social Media */}
                    <div className="col-span-2 sm:col-span-1 space-y-4">
                        {/* <h2 className="text-lg font-semibold mb-2">Our Social Apps</h2> */}
                        {/* <div className="flex justify-center items-center gap-2">
                        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg  text-sm md:text-base w-full md:w-auto">
                            <FaApple className="mr-2" /> Apple Store
                        </button>
                        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg text-sm md:text-base w-full md:w-auto">
                            <FaGooglePlay className="mr-2" /> Google Play
                        </button>
                        </div> */}
                      <div className="">
  <h2 className="text-lg font-semibold">Our Social Apps</h2>
  <div className="flex space-x-4 mt-2">
    <a
      href={socialmedia?.facebook || "#"}
      target={socialmedia?.facebook ? "_blank" : "_self"}
      rel={socialmedia?.facebook ? "noopener noreferrer" : undefined}
    >
      <FaFacebookF className="text-xl hover:text-gray-400 cursor-pointer" />
    </a>
    <a
      href={socialmedia?.twitter || "#"}
      target={socialmedia?.twitter ? "_blank" : "_self"}
      rel={socialmedia?.twitter ? "noopener noreferrer" : undefined}
    >
      <FaTwitter className="text-xl hover:text-gray-400 cursor-pointer" />
    </a>
    <a
      href={socialmedia?.tiktok || "#"}
      target={socialmedia?.tiktok ? "_blank" : "_self"}
      rel={socialmedia?.tiktok ? "noopener noreferrer" : undefined}
    >
      <FaTiktok className="text-xl hover:text-gray-400 cursor-pointer" />
    </a>
    <a
      href={socialmedia?.instagram || "#"}
      target={socialmedia?.instagram ? "_blank" : "_self"}
      rel={socialmedia?.instagram ? "noopener noreferrer" : undefined}
    >
      <FaInstagram className="text-xl hover:text-gray-400 cursor-pointer" />
    </a>
    <a
      href={socialmedia?.pinterest || "#"}
      target={socialmedia?.pinterest ? "_blank" : "_self"}
      rel={socialmedia?.pinterest ? "noopener noreferrer" : undefined}
    >
      <FaPinterest className="text-xl hover:text-gray-400 cursor-pointer" />
    </a>
  </div>
</div>

                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-400 text-sm md:text-base">© 2024 example.com. All rights reserved.</p>
                {/* <div className="flex space-x-4">
                    <a href="/pages/termsandconditions" className="text-gray-400 hover:text-gray-200 text-sm md:text-base">Terms & Conditions</a>
                    <a href="/pages/privacypolicy" className="text-gray-400 hover:text-gray-200 text-sm md:text-base">Privacy Notice</a>
                </div> */}
                <button
                    className="bg-[#FF0000] p-2 rounded-full hover:bg-[#FF0000]"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <FaArrowUp className="text-white" />
                </button>
            </div>
        </div>
    );
}
