import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import OnePartDetailCard from "./OnePartDetailCard";

export default function PopularParts() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [popularparts, setpopularparts] = useState([]);
    const cardRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products/popularParts');
                console.log("TOP RATED Products are: ", response.data.data);
                setpopularparts(response.data.data); // Assuming the API returns products in `data.data`
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        // Set card width once the component is mounted and ref is available
        if (cardRef.current) {
            setCardWidth(cardRef.current.offsetWidth);
        }
    }, [popularparts]);

    const calculateDiscountedPrice = (price, discount) => {
        if (!price || !discount) return price; // If no discount, return original price
        return price - (price * discount) / 100;
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex < popularparts.length - 1 ? prevIndex + 1 : 0
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : popularparts.length - 1
        );
    };

    return (
        <div className=" h-[400px] md:h-[600px] bg-black text-white px-4 md:px-12 flex flex-col justify-center">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 md:mb-10">
                <h1 className="text-2xl md:text-4xl font-bold">Popular Parts</h1>
                <button className="text-gray-400 flex items-center">
                    View All <FaArrowRight className="ml-1" />
                </button>
            </div>

            {/* Parts Slider */}
            <div className="relative flex items-center mt-10">
                <div className="overflow-hidden w-full">
                    <div
                        className="flex transition-transform duration-300 "
                        style={{ transform: `translateX(-${currentIndex * cardWidth}px)` }}
                    >
                        {popularparts.map((part, index) => (
                           
                            <div ref={index === 0 ? cardRef : null} key={index}>
                                 <div className="p-1">
                                <OnePartDetailCard
                                    image={part.images[0].url}
                                    title={part.name}
                                    description={part.description}
                                    price={(part.price).toLocaleString()}
                                    discountedPrice={calculateDiscountedPrice(part.price, part.discount).toLocaleString()}
                                    slug={part.slug}
                                />
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-start mt-4 space-x-4">
                <button
                    onClick={handlePrev}
                    className="p-2 rounded-full border-white px-4 border-2"
                >
                    <FaArrowLeft />
                </button>
                <button
                    onClick={handleNext}
                    className="p-2 rounded-full border-white px-4 border-2"
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
}
