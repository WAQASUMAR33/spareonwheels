'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ShopSpareParts() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [activeTab, setActiveTab] = useState("All Spare Parts");
    const router = useRouter();

    // Fetch products and brands when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await fetch('/api/make');
                const data = await response.json();
                setBrands(data);
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };

        fetchProducts();
        fetchBrands();
    }, []);

    // Filter products based on the active tab
    const filterProducts = () => {
        if (activeTab === "All Spare Parts") {
            return products;
        } else if (activeTab === "New Spare Parts") {
            return products.filter(product => product.type === "New");
        } else if (activeTab === "Used Spare Parts") {
            return products.filter(product => product.type === "Used");
        } else if (activeTab === "Browse By Brand") {
            return brands.map(brand => ({ name: brand.make, slug: brand.make, id: brand.id })); // Assuming brands is an array of brand objects with make and id properties
        }
    };

    const filteredProducts = filterProducts();

    // Handle click events for products and brands
    const handleProductClick = (product) => {
        router.push(`/product/${product.slug}`);
    };

    const handleBrandClick = (brand) => {
        router.push(`/filteredproducts?make=${brand.name}&id=${brand.id}`);
    };

    return (
        <div className="hidden md:flex flex-col w-full px-8 md:px-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">Shop Spare Parts</h1>
                <Link href='/filteredproducts' className="text-blue-500 hover:underline">View More</Link>
            </div>

            {/* Tabs */}
            <div className="w-full mx-auto md:px-4 md:py-8">
                <div className="flex gap-3 border-b border-gray-200">
                    {["All Spare Parts", "New Spare Parts", "Used Spare Parts", "Browse By Brand"].map((tab, index) => (
                        <button
                            key={index}
                            className={`md:py-4 text-sm md:text-base md:px-6 block hover:text-blue-500 focus:outline-none ${activeTab === tab ? 'text-blue-600 border-blue-500 border-b-2' : 'text-gray-600'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Items List */}
                <div className="mt-4 grid grid-cols-4  md:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-8">
                    {filteredProducts.slice(0,24).map((item, index) => (
                        <div
                            key={index}
                            className="text-gray-700 text-sm md:text-base py-2 hover:text-gray-900 cursor-pointer"
                            onClick={() => activeTab === "Browse By Brand" ? handleBrandClick(item) : handleProductClick(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
