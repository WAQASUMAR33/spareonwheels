import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SpareParts() {
  const [activeTab, setActiveTab] = useState("In Stock");
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        console.log("Products are: ",response.data);
        setProducts(response.data); // Assuming the API returns products in `data.data`
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="px-4 md:px-12 md:py-12">
      <h2 className="text-3xl font-bold mb-6">Spare Parts</h2>


      {/* <div className="flex flex-wrap gap-3 justify-between items-center"> */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

        
    {products.map((product) => {
      const discountedprice = product.price - (product.price * 0.1);
      return (
      <div>
            <ProductCard
                image={product.images[0].url}
                title={product.name}
                description={product.description}
                price={product.price}
                discountedprice={discountedprice}
                cardHeight="300px"
                slug={product.slug}
            />
            </div>
    )})}
</div>
</div>


    // </div>
  );
}
