import { FaArrowRight } from "react-icons/fa";

export default function ServiceSection2() {
    return (
        <>
            <div className="w-full md:h-[500px] grid grid-cols-1 md:grid-cols-2  md:px-12">
                <div>
                    <img src="/images/newsection.jpeg" className="w-full h-full object-cover"></img>
                </div>
                <div className="bg-[#646464] p-10 text-white md:rounded-r-xl">
                    <div>
                        <h1 className="text-3xl font-bold text-white mt-10">
                            Your Trusted Partner for Auto Spare Parts and Services
                        </h1>
                        <p className="text-sm mt-8">
                            At Spares On Wheels, we go the extra mile to keep your vehicles running smoothly.
                        </p>

                        <ul className="mt-6 space-y-4">
                            <li className="flex items-center">
                                <span className="bg-white max-w-4 max-h-4 min-w-4 min-h-4 rounded-full mr-3"></span>
                                Largest Inventory: Explore a wide range of top-quality spare parts for all vehicle makes and models.
                            </li>
                            <li className="flex items-center">
                                <span className="bg-white max-w-4 max-h-4 min-w-4 min-h-4 rounded-full mr-3"></span>
                                24/7 Roadside Assistance: We're here for you anytime, anywhere.

                            </li>
                            <li className="flex items-center">
                                <span className="bg-white max-w-4 max-h-4 min-w-4 min-h-4 rounded-full mr-3"></span>
                                Reliable Service: Proudly fixing 4 out of 5 cars right at the roadside.

                            </li> <li className="flex items-center">
                                {/* <span className="bg-white w-4 h-4 rounded-full mr-3"></span> */}
                                Ready to drive worry-free?
                            </li>
                        </ul>
                        <a href="/login">

                        <button className="bg-[#FF0000] text-white py-2 px-6 mt-4 rounded flex items-center space-x-2">
                            Get Started
                            <FaArrowRight className="transform -rotate-45 font-100 ml-2" />

                        </button>
                        </a>
                    </div>
                </div>

            </div>
        </>
    )
}