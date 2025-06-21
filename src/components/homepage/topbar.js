import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TopBar({phone,email,name}) {
    const [searchText, setSearchText] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (searchText.trim()) {
            router.push(`/product/search?searchtext=${encodeURIComponent(searchText)}`);
        }
    };

    return (
        <>
            <div className="hidden h-[50px] md:flex w-full">
                <div className="bg-[#ff0000] w-[35%] flex justify-center items-center space-x-10 text-[14px] font-700 text-white">
                    <p>Call Us: <a href="tel:+923446540444">{phone}</a></p>
                    <a href={`mailto:${email}`}>{email}</a>
                    {/* <a href="/pages/contactus">Contacts</a> */}
                </div>
                <div className="bg-[#ff0000] w-[30%] flex justify-center items-center ">
                    <h1 className="text-3xl text-white text-center font-[600]">
                        {name}
                    </h1>
                    {/* <div className="flex items-center bg-white rounded-full border-black w-full">
                        <input
                            type="text"
                            placeholder="Search Spare Parts"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="h-[35px] w-full rounded-l-full px-4 text-gray-700 focus:outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            className="h-[35px] w-16 bg-black rounded-r-full flex items-center justify-center"
                        >
                            <FaSearch className="text-white" />
                        </button>
                    </div> */}
                </div>

                <div className="bg-[#ff0000] w-[35%] flex justify-center items-center">
                    <div className="flex text-[14px] text-white justify-center items-center space-x-8">
                        <Link href='/pages/contactus' className="px-3 py-1 rounded-full hover:bg-black">Get a Quote: <span>5</span></Link>
                        <button>Language: Eng</button>
                    </div>
                </div>
            </div>
        </>
    );
}
