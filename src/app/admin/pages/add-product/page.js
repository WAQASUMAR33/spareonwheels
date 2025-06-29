'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select from 'react-select';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AddProductPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id'); 

  const [newProduct, setNewProduct] = useState({
    id: null,
    name: '',
    slug: '',
    type: 'New',
    dtype:'Medium',
    richDescription: '',
    costprice: '',
    price: '',
    stock: '',
    categorySlug: '',
    subcategorySlug: '',
    makeId: '',
    modelId: '',
    yearId: '',
    // colors: [],
    // sizes: [],
    images: [],
    discount: '',
    isTopRated: false,
    isPopular: false,
    isFeatured: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  // const [colors, setColors] = useState([]);
  // const [sizes, setSizes] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [filteredModels, setFilteredModels] = useState([]);

  useEffect(() => {
    if (newProduct.makeId) {
      console.log("new product is", newProduct.makeId);
      console.log("All models : ", models);

      setFilteredModels(models.filter((model) => model.makeId === newProduct.makeId));

      console.log("Filtered models are: ", models.filter((model) => model.makeId === newProduct.makeId));
    } else {
      setFilteredModels([]); // Clear if no make is selected
    }
  }, [newProduct.makeId, models]);
  useEffect(() => {
    fetchCategories();
    // fetchColors();
    // fetchSizes();
    fetchMakes();
    fetchModels();
    fetchYears();

    if (productId) {
      fetchProductData(productId);
    }
  }, [productId]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories'); // Ensure API returns categories with slugs
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      console.log('Fetched categories with slug:', data);
      setCategories(data); // Assuming 'data' is an array containing slugs
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set to empty array if there's an error
    }
  };

  const fetchSubcategories = async (categorySlug) => {
    try {
      const response = await fetch(`/api/subcategories/${categorySlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }

      const data = await response.json();
      console.log("Fetched subcategories:", data);
      setFilteredSubcategories(data?.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setFilteredSubcategories([]);
    }
  };

  // const fetchColors = async () => {
  //   try {
  //     const response = await fetch('/api/colors');
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch colors');
  //     }
  //     const data = await response.json();
  //     const mappedColors = data.map(color => ({
  //       value: color.id,
  //       label: `${color.name} (${color.hex})`,
  //       hex: color.hex,
  //     }));
  //     setColors(mappedColors);
  //   } catch (error) {
  //     console.error('Error fetching colors:', error);
  //     setColors([]);
  //   }
  // };

  // const fetchSizes = async () => {
  //   try {
  //     const response = await fetch('/api/sizes');
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch sizes');
  //     }
  //     const data = await response.json();
  //     const mappedSizes = data.map(size => ({
  //       value: size.id,
  //       label: size.name,
  //     }));
  //     setSizes(mappedSizes);
  //   } catch (error) {
  //     console.error('Error fetching sizes:', error);
  //     setSizes([]);
  //   }
  // };

  const fetchMakes = async () => {
    try {
      const response = await fetch('/api/make');
      const data = await response.json();
      setMakes(data.map(make => ({ value: make.id, label: make.make })));
    } catch (error) {
      console.error('Error fetching makes:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/model');
      const data = await response.json();
      setModels(data.map(model => ({ value: model.id, label: model.model, makeId: model.makeId })));
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await fetch('/api/year');
      const data = await response.json();
      setYears(data.map(year => ({ value: year.id, label: year.year })));
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const fetchProductData = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const data = await response.json();

      // const parsedColors = Array.isArray(data.colors)
      //   ? data.colors.map(color => ({
      //     value: color.id,
      //     label: `${color.name} (${color.hex})`,
      //     hex: color.hex,
      //   }))
      //   : [];

      // const parsedSizes = Array.isArray(data.sizes)
      //   ? data.sizes.map(size => ({
      //     value: size.id,
      //     label: size.name,
      //   }))
      //   : [];

      setNewProduct({
        ...data,
        // colors: data.colors.map(color => ({ value: color.id, label: color.name })),
        // sizes: data.sizes.map(size => ({ value: size.id, label: size.name })),
        makeId: data.makeId,
        modelId: data.modelId,
        yearId: data.yearId,
      });

      setExistingImages(data.images || []);

      if (data.categoryId) {
        await fetchSubcategories(data.categoryId);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
    setIsLoading(false);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleAddNewItem = async () => {

    const requiredFields = [
      { name: 'name', label: 'Product Name' },
      { name: 'richDescription', label: 'Description' },
      { name: 'price', label: 'Price' },
      { name: 'stock', label: 'Stock' },
      { name: 'type', label: 'Type' },
      { name: 'dtype', label: 'Dtype' },
      { name: 'categorySlug', label: 'Category' },
      { name: 'subcategorySlug', label: 'Subcategory' },
    ];

    const missingFields = requiredFields
      .filter(field => typeof newProduct[field.name] === 'string' && !newProduct[field.name].trim()) // Ensure it's a string before trimming
      .map(field => field.label);


    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
     
      const existingProductResponse = await fetch(`/api/products?slug=${newProduct.slug}`);
      const existingData = await existingProductResponse.json();

      if (existingData.status === false) {
        alert('Product with this slug already exists.');
        setIsLoading(false);
        return;
      }

      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          const imageBase64 = await convertToBase64(img);
          const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageBase64 }),
          });
          const result = await response.json();
          if (response.ok) {
            const imageFileName = result.image_url; // Get only the filename from the response
            console.log('Image saved with filename:', imageFileName); // Log the saved filename
            return imageFileName; // Ensure that only the filename is returned
          } else {
            throw new Error(result.error || 'Failed to upload image');
          }
        })
      );

      const imageUrls = uploadedImages.map((filename) => `${filename}`);

      const productToSubmit = {
        ...newProduct,
        slug: generateSlug(newProduct.name),
        description: newProduct.richDescription,
        costprice: parseFloat(newProduct.costprice),
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        type: newProduct.type,
        dtype: newProduct.dtype,
        subcategorySlug: newProduct.subcategorySlug,
        // colors: JSON.stringify(newProduct.colors.map((color) => color.value)),
        // sizes: JSON.stringify(newProduct.sizes.map((size) => size.value)),
        images: imageUrls, // Send full URLs for validation
        discount: newProduct.discount ? roundToTwoDecimalPlaces(parseFloat(newProduct.discount)) : null,
        isTopRated: newProduct.isTopRated,
        isPopular: newProduct.isPopular,
        isFeatured: newProduct.isFeatured,
        meta_title: newProduct.meta_title,
        meta_description: newProduct.meta_description,
        meta_keywords: newProduct.meta_keywords,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSubmit),
      });

      if (response.ok) {
        router.push('/admin/pages/Products');
      } else {
        const errorData = await response.json();
        console.error('Failed to create product:', errorData.message);
        alert(`Failed to create product: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert(`Error adding product: ${error.message}`);
    }

    setIsLoading(false);
  };



  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };



  const roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6  h-full">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 relative">
        <h2 className="text-2xl mb-6">
          {newProduct.id ? 'Edit Product' : 'Add New Product'}
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newProduct.categorySlug}
                onChange={(e) => {
                  const categorySlug = e.target.value;
                  setNewProduct({ ...newProduct, categorySlug, subcategorySlug: '' });
                  fetchSubcategories(categorySlug); // Fetch subcategories by slug when category changes
                }}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {Array.isArray(categories.data) && categories.data.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {filteredSubcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  value={newProduct.subcategorySlug}
                  onChange={(e) => setNewProduct({ ...newProduct, subcategorySlug: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subcategory</option>
                  {filteredSubcategories.map((subcategory) => (
                    <option key={subcategory.slug} value={subcategory.slug}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make {newProduct.makeId}</label>
              <Select
                value={makes.find(make => make.value === newProduct.makeId)}
                onChange={(selected) => setNewProduct({ ...newProduct, makeId: selected.value })}
                options={makes}
                placeholder="Select Make"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <Select
                value={models.find(model => model.value === newProduct.modelId)}
                onChange={(selected) => setNewProduct({ ...newProduct, modelId: selected.value })}
                options={filteredModels}
                placeholder="Select Model"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <Select
                value={years.find(year => year.value === newProduct.yearId)}
                onChange={(selected) => setNewProduct({ ...newProduct, yearId: selected.value })}
                options={years}
                placeholder="Select Year"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={newProduct.slug}
                onChange={(e) => {
                  const slugValue = e.target.value.replace(/\s+/g, '-'); // Replaces spaces with dashes
                  setNewProduct({ ...newProduct, slug: slugValue });
                }}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Slug will be generated automatically.."
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Price (Rs.)
              </label>
              <input
                type="number"
                value={newProduct.costprice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, costprice: e.target.value })
                }
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Cost price"
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (Rs.)
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={newProduct.stock !== null ? newProduct.stock.toString() : ''}
                min="0"
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value >= 0) {
                    setNewProduct({ ...newProduct, stock: value });
                  }
                }}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newProduct.type || 'New'}
                onChange={(e) => {
                  setNewProduct({ ...newProduct, type: e.target.value });
                }}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DType
              </label>
              <select
                value={newProduct.dtype }
                onChange={(e) => {
                  setNewProduct({ ...newProduct, dtype: e.target.value });
                }}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" >Select DType</option> {/* Changed to empty string for better handling */}
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                value={newProduct.discount ? roundToTwoDecimalPlaces(newProduct.discount) : ''}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    discount: e.target.value ? parseFloat(e.target.value) : '',
                  })
                }
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter discount percentage"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newProduct.isFeatured}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, isFeatured: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Featured
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newProduct.isTopRated}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, isTopRated: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Top Rated
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newProduct.isPopular}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, isPopular: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Popular
              </label>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colors
              </label>
              <Select
                isMulti
                value={newProduct.colors}
                onChange={(selected) =>
                  setNewProduct({ ...newProduct, colors: selected })
                }
                options={colors}
                className="mt-1"
                classNamePrefix="select"
                placeholder="Select colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sizes
              </label>
              <Select
                isMulti
                value={newProduct.sizes}
                onChange={(selected) =>
                  setNewProduct({ ...newProduct, sizes: selected })
                }
                options={sizes}
                className="mt-1"
                classNamePrefix="select"
                placeholder="Select sizes"
              />
            </div> */}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Description</h3>
          <ReactQuill
            value={newProduct.richDescription}
            onChange={(value) =>
              setNewProduct({ ...newProduct, richDescription: value })
            }
            className="h-64"
            placeholder="Enter product description..."
          />
        </div>

        <div className='mt-12'>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
          <input
            type="text"
            value={newProduct.meta_title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, meta_title: e.target.value })
            }
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter meta title"
          />
        </div>

        <div className='mt-4'>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
          <textarea
            value={newProduct.meta_description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, meta_description: e.target.value })
            }
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter meta description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
          <input
            type="text"
            value={newProduct.meta_keywords}
            onChange={(e) =>
              setNewProduct({ ...newProduct, meta_keywords: e.target.value })
            }
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter meta keywords"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Upload Images</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload New Images
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
              ref={fileInputRef}
              accept="image/*"
            />
          </div>

          {existingImages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Existing Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${img}`}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-[#FF0000] text-white rounded-full p-1"
                      title="Remove Image"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">New Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`New Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-[#FF0000] text-white rounded-full p-1"
                      title="Remove Image"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push('/admin/pages/Products')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={newProduct.id ? updateProduct : handleAddNewItem}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {newProduct.id ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddProductPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <AddProductPageContent />
    </Suspense>
  );
};

export default AddProductPage;