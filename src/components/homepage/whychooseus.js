import { FaTags, FaCar, FaMoneyBillWave, FaTools } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="px-4 md:px-12 py-8 w-full flex flex-col items-center">
            <div className="text-center w-full mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">
                    Why Choose Us?
                </h1>
                <p className="text-gray-600 md:text-lg">
                    At Spares on Wheels, we prioritize quality, reliability, and customer satisfaction. 
                    Here’s why we’re the go-to choice for auto parts:
                </p>
            </div>

            <motion.div
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.2,
                        },
                    },
                }}
            >
                {[
                    {
                        Icon: FaTags,
                        title: "Genuine Parts",
                        description:
                            "We source only authentic, high-quality OEM and aftermarket parts to keep your vehicle in top condition.",
                        color: "text-blue-500",
                    },
                    {
                        Icon: FaCar,
                        title: "Expert Guidance",
                        description:
                            "Our knowledgeable team is here to assist you in finding the right parts for your vehicle.",
                        color: "text-green-500",
                    },
                    {
                        Icon: FaMoneyBillWave,
                        title: "Competitive Pricing",
                        description:
                            "Enjoy fair, transparent pricing on all products without compromising quality.",
                        color: "text-orange-500",
                    },
                    {
                        Icon: FaTools,
                        title: "Fast & Secure Shipping",
                        description:
                            "Count on timely deliveries and secure packaging for peace of mind.",
                        color: "text-purple-500",
                    },
                    {
                        Icon: FaTools,
                        title: "Customer-Centric Service",
                        description:
                            "We’re dedicated to creating a seamless shopping experience, from browsing to post-purchase support.",
                        color: "text-[#FF0000]",
                    },
                ].map(({ Icon, title, description, color }, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center gap-4 p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        variants={cardVariants}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Icon className={`text-4xl ${color}`} />
                        <h2 className="text-sm md:text-lg font-semibold text-gray-800 text-center">{title}</h2>
                        <p className="text-xs md:text-sm text-gray-600 text-center ">{description}</p>
                    </motion.div>
                ))}
            </motion.div>

            <p className="mt-8 text-center text-xl md:text-2xl font-medium text-gray-700">
                Experience the Spares on Wheels difference—where quality meets convenience!
            </p>
        </div>
    );
}
