import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";

export default function OnePartDetailCard({ image, title, description,slug, feature1, feature2, feature3, price, discountedPrice }) {
    return (
        <div className="flex rounded-lg overflow-hidden shadow-lg min-w-[320px] md:min-w-[600px] h-[200px] md:h-[250px] bg-white/10 text-white">
            {/* Left: Image Section */}
            
            <div className="relative w-1/2 bg-black">
            <a href={`/product/${slug}`}>
                <img src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${image}`} alt={title} className="w-full h-full object-fill" />
                </a>
                {/* Sale Badge */}
                <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Sale
                </div>
                {/* Bookmark Icon */}
                <div className="absolute top-3 right-3 text-white">
                    <FaRegBookmark />
                </div>
            </div>
            

            {/* Right: Content Section */}
            <div className="w-1/2 p-4 flex flex-col justify-between">
                {/* Title and Description */}
                <div>
                <a href={`/product/${slug}`}>
                    <p className="text-base font-semibold">{title}</p>
                    </a>
                    <p 
  className="text-gray-300 text-xs leading-relaxed line-clamp-4" 
  dangerouslySetInnerHTML={{ __html: description }} 
/>
                </div>

                {/* Features
                <div className="mt-2 text-sm text-gray-300 space-y-1">
                    <p>{feature1}</p>
                    <p>{feature2}</p>
                    <p>{feature3}</p>
                </div> */}

                {/* Price and Button */}
                <div className="flex md:flex-row flex-col md:justify-between justify-start items-start md:items-end mt-4">
                    <div>
                        <p className="line-through text-gray-500 text-xs md:text-sm">Rs {price}</p>
                        <p className="text-sm md:text-lg font-bold">Rs {discountedPrice}</p>
                    </div>
                    <div>
                    <Link href={`/product/${slug}`}>
                    <button className="text-white text-[12px] md:text-[15px] font-500 flex justify-center items-center hover:bg-white/5 px-4 py-2 rounded-full transform">
                        View Details <FaArrowRight className="ml-1 transform -rotate-45" />
                    </button>
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
