import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

function ProductCard({ image, title, description, price,discountedprice, cardHeight, slug }) {
  return (
    <div
      // style={{ height: '400px' }}
      className={`bg-white text-[14px] md:h-[400px]  md:text-[14px] rounded-lg shadow-md border border-gray-300 p-2 flex flex-col flex-shrink-0`}
    >
      {/* Image */}
      <a href={`/product/${slug}`}>
        <div className="flex h-52 md:h-60 justify-center items-center bg-gray-100 rounded overflow-hidden mb-1 md:mb-4">
          <img src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${image}`} alt={title} className="h-full w-full object-cover" />
        </div>
      </a>

      {/* Text content */}
      <div className="text-left flex-1 px-1">
        <a href={`/product/${slug}`}>
          <h3 className="font-semibold text-gray-900 md:mb-2">{title}</h3>
        </a>
        <p
          className="hidden md:flex text-gray-600 leading-relaxed line-clamp-3"
          dangerouslySetInnerHTML={{ __html: description }}
        />

      </div>

      {/* Price and Button */}
      <div className="flex md:flex-row flex-col justify-between items-center mt-2 border-t border-gray-200  md:pt-3 md:pl-3">
      <div className="flex items-center space-x-2 py-2 md:py-0">
          {discountedprice ? (
            <>
              <span className="text-[12px] md:text-[16px] font-bold text-gray-800 line-through">Rs {price}</span>
              <span className="text-[12px] md:text-[16px] font-bold text-red-600">Rs {discountedprice}</span>
            </>
          ) : (
            <span className="text-[12px] md:text-[16px] font-bold text-gray-800">Rs {price}</span>
          )}
        </div>
      
        <a href={`/product/${slug}`}>
          <button className="text-[#FF0000] text-[12px] md:text-[14px] w-24 md:w-32 justify-center font-500 flex items-center hover:bg-[#FF0000] hover:text-white transition border p-1 md:p-2 border-[#FF0000] hover:border-white">
            View Details <FaArrowRight className="ml-1 transform -rotate-45" />
          </button>
        </a>
      </div>
    </div>
  );
}

export default ProductCard;

