import ProductCard from "./ProductCard";
import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios"; // Import axios for API calls

export default function ExploreAllVehicleParts() {
  const [activeTab, setActiveTab] = useState("In Stock");
  const sliderRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setAllProducts(response.data); // Assuming the API returns products in `data.data`
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Update the filtered products whenever the active tab changes
  useEffect(() => {
    if (activeTab === "In Stock") {
      setFilteredProducts(allProducts);
    } else if (activeTab === "New Cars") {
      setFilteredProducts(allProducts.filter(product => product.type === "New"));
    } else if (activeTab === "Used Cars") {
      setFilteredProducts(allProducts.filter(product => product.type === "Used"));
    }
  }, [activeTab, allProducts]);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="md:px-12 px-4 py-4 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Explore All Vehicle Parts</h2>

      {/* Tabs */}
      <div className="flex space-x-4 md:space-x-8 mb-6">
        {["In Stock", "New Cars", "Used Cars"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${activeTab === tab ? "border-b-2 border-[#FF0000] text-black" : "text-gray-500"} font-semibold`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <div ref={sliderRef} className="flex overflow-x-scroll no-scrollbar">
          {filteredProducts.map((product) => {
            const discountedprice = product.price - (product.price * product.discount / 100);
            return (
              <div key={product.id} className="min-w-[200px] max-w-[200px] md:min-w-[350px] md:max-w-[350px]">
                <div className="p-1 md:p-2">
                  <ProductCard
                    image={product.images[0]?.url}
                    title={product.name}
                    description={product.description}
                    price={product.price}
                    discountedprice={discountedprice}
                    cardwidth='350px'
                    cardHeight='300px'
                    slug={product.slug}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-start mt-4 space-x-4">
        <button onClick={scrollLeft} className="hover:bg-gray-200 text-black rounded p-2 shadow-md">
          <FaArrowLeft />
        </button>
        <button onClick={scrollRight} className="hover:bg-gray-200 text-black rounded p-2 shadow-md">
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
