import React, { useEffect, useState, useRef } from 'react';
import AllProductsCards from './AllProductCards';

import { FaChevronRight, FaBars, FaTimes } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
const CategoryProductPage = () => {
    const searchParams = useSearchParams();
    const fetchedSlug = searchParams.get('slug');
    const fetchedName = searchParams.get('name');
    const fetchedId = searchParams.get('id');
    const fetchedMake = searchParams.get('make');

    console.log('Slug fetched:', fetchedSlug);
    console.log('Name fetched:', fetchedName);
    useEffect(() => {
        if (fetchedSlug && fetchedName) {
            setFiltersSubcategory((prevFilters) => {
                if (!prevFilters.some((filter) => filter.slug === fetchedSlug)) {
                    return [{ name: fetchedName, slug: fetchedSlug }];
                }
                return prevFilters;
            });
        }
    }, [fetchedSlug, fetchedName]);

    useEffect(() => {
        if (fetchedMake && fetchedId) {
            setFilterBrand((prevFilters) => {
                // Check if the brand is already in the filter to avoid duplication
                if (!prevFilters.some((filter) => filter.id === fetchedId)) {
                    return [{ make: fetchedMake, id: fetchedId }];
                }
                return prevFilters;
            });
        }
    }, [fetchedMake, fetchedId]);




    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]); // All products from the API
    const [filteredProducts, setFilteredProducts] = useState([]); // Products after applying filters
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [filtersSubcategory, setFiltersSubcategory] = useState([]); // Array to hold selected subcategories with name and slug
    const [filterBrand, setFilterBrand] = useState([]); // Array to hold selected brands with make and id
    const dropdownRef = useRef(null);
    const [sortOption, setSortOption] = useState("price");

    // Fetch categories, subcategories, brands, and products from API
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }

        async function fetchSubcategories() {
            try {
                const response = await fetch('/api/subcategories');
                const data = await response.json();
                setSubcategories(data.data);
            } catch (error) {
                console.error('Failed to fetch subcategories:', error);
            }
        }

        async function fetchBrands() {
            try {
                const response = await fetch('/api/make');
                const data = await response.json();
                setBrands(data);
            } catch (error) {
                console.error('Failed to fetch brands:', error);
            }
        }

        async function fetchProducts() {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data); // Initially show all products
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        }

        fetchCategories();
        fetchSubcategories();
        fetchBrands();
        fetchProducts();
    }, []);

    // Filter subcategories by selected category
    const filteredSubcategories = subcategories.filter(
        (subcategory) => subcategory.categoryId === selectedCategory
    );

    // Click outside handler to close the dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSelectedCategory(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

    // Handle adding subcategory to filters
    const addFilter = (subcategory) => {
        const isFilterApplied = filtersSubcategory.some(
            (filter) => filter.name === subcategory.name && filter.slug === subcategory.slug
        );

        if (!isFilterApplied) {
            setFiltersSubcategory([
                ...filtersSubcategory,
                { name: subcategory.name, slug: subcategory.slug }
            ]);
        }
    };


    // Handle removing subcategory from filters
    const removeFilter = (slug) => {
        setFiltersSubcategory(filtersSubcategory.filter((filter) => filter.slug !== slug));
    };

    // Handle adding/removing brand to/from filterBrand
    const toggleBrandFilter = (brand) => {
        const isAlreadyFiltered = filterBrand.some((filter) => filter.id == brand.id);

        if (isAlreadyFiltered) {
            // Remove brand from filterBrand if it's already selected
            setFilterBrand(filterBrand.filter((filter) => filter.id != brand.id));
        } else {
            // Add brand to filterBrand only if it's not selected
            setFilterBrand([...filterBrand, { make: brand.make, id: brand.id }]);
        }
    };

    // Remove brand from filterBrand
    const removeBrandFilter = (id) => {
        setFilterBrand(filterBrand.filter((filter) => filter.id != id));
    };

    // Apply filters to products whenever the selected filters change
    useEffect(() => {
        let filtered = products;

        // Filter by subcategory slug
        if (filtersSubcategory.length > 0) {
            filtered = filtered.filter((product) =>
                filtersSubcategory.some((subcategory) => subcategory.slug === product.subcategorySlug)
            );
        }

        // Filter by brand id
        if (filterBrand.length > 0) {
            filtered = filtered.filter((product) =>
                filterBrand.some((brand) => brand.id == product.makeId)
            );
        }

        // Apply sorting
        if (sortOption === "price") {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === "alphabetically") {
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredProducts(filtered);
    }, [products, filtersSubcategory, filterBrand, sortOption]);


    return (
        <div className="w-full flex px-[5px]">
            {/* Sidebar with Categories and Brands */}
            <div className="hidden md:flex flex-col md:w-1/4 border-r border-gray-300 relative p-2">
                <div className="min-w-full">
                    {/* Category Header */}
                    <div className="flex items-center p-4 bg-[#FF0000] text-white">
                        {/* <FaBars className="mr-2" /> */}
                        <p className="text-center font-semibold">Category</p>
                    </div>

                    {/* Category List */}
                    <ul className="space-y-1">
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`relative flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100  hover:text-gray-900 ${selectedCategory === category.id ? 'bg-[#FF0000] text-white' : ''
                                    }`}
                            >
                                <span className="font-medium">{category.name}</span>
                                <FaChevronRight />

                                {/* Subcategories Dropdown */}
                                {selectedCategory === category.id && filteredSubcategories.length > 0 && (
                                    <div ref={dropdownRef} className="absolute left-full top-0 ml-1 w-48 bg-white shadow-lg border rounded-lg p-2">
                                        <div className="flex items-center p-3 bg-[#FF0000] text-white">
                                            {/* <FaBars className="mr-2" /> */}
                                            <p className="text-center font-semibold">Sub Category</p>
                                        </div>
                                        <ul>
                                            {filteredSubcategories.map((subcategory) => (
                                                <li
                                                    key={subcategory.id}
                                                    onClick={() => addFilter(subcategory)}
                                                    className="p-2 hover:bg-gray-100  hover:text-gray-900 text-black cursor-pointer"
                                                >
                                                    {subcategory.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Brands Section */}
                    <div className="mt-4">
                        <div className="flex items-center p-4 bg-[#FF0000] text-white">
                            {/* <FaBars className="mr-2" /> */}
                            <p className="text-center font-semibold">Brands</p>
                        </div>
                        <ul className="space-y-1">
                            {brands.map((brand) => (
                                <li
                                    key={brand.id}
                                    className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100  hover:text-gray-900"
                                >
                                    <span className="font-medium">{brand.make}</span>
                                    <input
                                        type="checkbox"
                                        onChange={() => toggleBrandFilter(brand)}
                                        checked={filterBrand.some((filter) => filter.id == brand.id)}
                                        className="ml-2 cursor-pointer"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Content with Filter Tags and Product Cards */}
            <div className="flex flex-col w-full  md:p-4">
                {/* Selected Subcategories as Filter Tags */}
                <div className="flex gap-2 mb-4 w-full items-center justify-between px-4 md:px-0">
                    <div className="flex gap-2">
                        {filtersSubcategory.map((filter) => (
                            <div
                                key={filter.slug}
                                className="flex h-8 md:h-auto  w-20 md:w-auto justify-center items-center text-xs md:text-base md:px-3 px-1 py-1 bg-gray-200 text-gray-800 rounded-full border border-gray-300"
                            >
                                <span className='md:flex md:gap-1'> <span className='hidden md:flex'>Category: </span> {filter.name}</span>
                                <FaTimes
                                    onClick={() => removeFilter(filter.slug)}
                                    className="ml-2 cursor-pointer"
                                />
                            </div>
                        ))}

                        {filterBrand.map((filter) => (
                            <div
                                key={filter.id}
                                className="flex h-8 md:h-auto  w-20 md:w-auto justify-center items-center text-xs md:text-base md:px-3 px-1 py-1 bg-gray-200 text-gray-800 rounded-full border border-gray-300"
                            >
                                <span className='md:flex md:gap-1'> <span className='hidden md:flex'>Brand: </span> {filter.make}</span>

                                <FaTimes
                                    onClick={() => removeBrandFilter(filter.id)}
                                    className="ml-2 cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="ml-auto">
                        <label htmlFor="sort" className="mr-2 font-semibold">Sort by:</label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="price">Price</option>
                            <option value="alphabetically">Alphabetically</option>
                        </select>
                    </div>
                </div>

                <div className='pb-4 md:pb-0 '>
                    <AllProductsCards products={filteredProducts} />
                </div>
            </div>
        </div>
    );
}

export default CategoryProductPage;