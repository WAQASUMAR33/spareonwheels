"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CustomerLayout from "../../customer/layout";

const CategoryPage = () => {
  const params = useParams();
  const slug = decodeURIComponent(params.slug);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryResponse = await fetch("/api/categories");
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.data);

        const subcategoryResponse = await fetch("/api/subcategories");
        const subcategoryData = await subcategoryResponse.json();
        setSubcategories(subcategoryData.data);

        const matchingCategory = categoryData.data.find(
          (category) => category.name.toLowerCase() === slug.toLowerCase()
        );

        if (matchingCategory) {
          const categorySubcategories = subcategoryData.data.filter(
            (subcategory) => subcategory.categoryId === matchingCategory.id
          );
          setFilteredSubcategories(categorySubcategories);
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-3xl font-bold text-center mb-6 capitalize">
          {slug.replace(/-/g, " ")}
        </h1>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        ) : filteredSubcategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSubcategories.map((subcategory) => (
              <a
                href={`/filteredproducts?name=${subcategory.name}&slug=${subcategory.slug}`}
                key={subcategory.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col border border-gray-400 hover:border hover:border-[red]"
              >
                {/* {subcategory.imageUrl ? (
                  <div className="md:h-52 h-28 w-full mx-auto flex justify-center items-center  text-7xl font-bold text-gray-700 rounded-t-lg">
                     {subcategory.name[0].toUpperCase()}
                    <img
                      src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${subcategory.imageUrl}`}
                      alt={subcategory.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                ) : (
                  <div className="md:h-52 h-28 mx-auto flex justify-center items-center bg-gray-300 text-4xl font-bold text-gray-700 rounded-t-lg">
                    {subcategory.name[0].toUpperCase()}
                  </div>
                )} */}
                <div>
                  <h2 className="text-xl font-semibold mt-2">
                    {subcategory.name}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {subcategory.meta_description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No subcategories available for this category.
          </p>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CategoryPage;
