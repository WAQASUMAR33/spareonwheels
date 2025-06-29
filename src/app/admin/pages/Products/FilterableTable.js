'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const FilterableTable = ({
  products = [],
  fetchProducts,
  categories = [],
  subcategories = [],
  colors = [],
  sizes = [],
}) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(products);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemSlugToDelete, setItemSlugToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    costprice: '',
    price: '',
    stock: '',
    type: '',
    dtype: '',
    subcategorySlug: '',
    // colors: [],
    // sizes: [],
    discount: '',
    isTopRated: false,
    isPopular: false,
    isFeatured: false,
    images: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    makeId: null, // New field
    modelId: null, // New field
    yearId: null, // New field
  });
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [filteredModels, setFilteredModels] = useState([]);



  useEffect(() => {
    if (productForm.makeId) {
      console.log("new product is", productForm.makeId);
      console.log("All models : ", models);

      setFilteredModels(models.filter((model) => model.makeId === productForm.makeId));

      console.log("Filtered models are: ", models.filter((model) => model.makeId === productForm.makeId));
    } else {
      setFilteredModels([]); // Clear if no make is selected
    }
  }, [productForm.makeId, models]);


  useEffect(() => {
    fetchMakes();
    fetchModels();
    fetchYears();
  }, []);

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

  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  // Check if the user role is in localStorage
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role); // Set role state based on localStorage
    } else {
      router.push('/login'); // Redirect to login if no role found
    }
  }, [router]);

  useEffect(() => {
    setFilteredData(
      products.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, products]);

  useEffect(() => {
    if (subcategories.length && selectedCategory) {
      setFilteredSubcategories(
        subcategories.filter(
          (subcat) => subcat.categoryId === parseInt(selectedCategory)
        )
      );
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  const handleDeleteClick = (slug) => {
    setItemSlugToDelete(slug);
    setIsPopupVisible(true);
  };

  const handleDeleteItem = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${itemSlugToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log(`Product with slug "${itemSlugToDelete}" deleted successfully.`);
        fetchProducts(); // Refresh the data after deleting
        setIsPopupVisible(false);
        toast.success(`Product with slug "${itemSlugToDelete}" deleted successfully!`); // Show success toast
      } else {
        console.error('Failed to delete product');
        toast.error('Failed to delete product.'); // Show error toast
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('An error occurred while deleting the product.'); // Show error toast
    }
    setIsLoading(false);
  };

  const handleCancelDelete = () => {
    setIsPopupVisible(false);
    setItemSlugToDelete(null);
  };

  const handleEditItem = (item) => {
    setEditProduct(item);

    // const existingColors = colors
    //   .filter((color) => item.colors.includes(color.id))
    //   .map((color) => ({
    //     value: color.id,
    //     label: `${color.name} (${color.hex})`,
    //     hex: color.hex,
    //   }));

    // const existingSizes = sizes
    //   .filter((size) => item.sizes.includes(size.id))
    //   .map((size) => ({ value: size.id, label: size.name }));

    setProductForm({
      name: item.name,
      slug: item.slug,
      description: item.description,
      costprice: item.costprice,
      price: item.price,
      stock: item.stock,
      type: item.type,
      dtype: item.dtype,
      subcategorySlug: item.subcategorySlug,
      // colors: existingColors,
      // sizes: existingSizes,
      makeId: item.makeId,
      modelId: item.modelId,
      yearId: item.yearId,
      discount: item.discount || '',
      isTopRated: item.isTopRated || false,
      isPopular: item.isPopular || false, // Set initial isPopular value
      isFeatured: item.isFeatured || false, // Set initial isFeatured value
      images: [],
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      meta_keywords: item.meta_keywords || '',
    });

    // Store relative paths
    const relativeImageURLs = item.images.map((img) => img.url);
    console.log("Loaded existing images (relative paths):", relativeImageURLs);
    setExistingImages(relativeImageURLs);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (name === 'stock') {
      const parsedValue = parseInt(value, 10);
      newValue = isNaN(parsedValue) ? '' : Math.max(0, parsedValue);
    } else {
      newValue = value;
    }

    setProductForm({
      ...productForm,
      [name]: newValue,
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Handle new image uploads using productForm.images
      const uploadedImages = await Promise.all(
        productForm.images.map(async (file) => {
          const imageBase64 = await convertToBase64(file);
          console.log("Uploading image:", file.name); // Log image details
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ image: imageBase64 }),
            }
          );
          const result = await response.json();
          if (response.ok) {
            console.log(
              "Uploaded image URL:",
              `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${result.image_url}`
            );
            return result.image_url; // Return relative path
          } else {
            throw new Error(result.error || 'Failed to upload image');
          }
        })
      );

      const stockValue = parseInt(productForm.stock, 10);

      // Extract relative image paths from existingImages
      const existingRelativeImages = existingImages; // These are already relative paths

      const productData = {
        ...productForm,
        stock: isNaN(stockValue) ? 0 : stockValue,
        images: [
          ...existingRelativeImages,
          ...uploadedImages,
        ],
        discount: productForm.discount ? productForm.discount : null,
        type: productForm.type,
        dtype: productForm.dtype,
        isTopRated: productForm.isTopRated,
        isPopular: productForm.isPopular, // Add isPopular to productData
        isFeatured: productForm.isFeatured, // Add isFeatured to productData
        // colors: productForm.colors.map((color) => color.value),
        // sizes: productForm.sizes.map((size) => size.value),
        makeId: productForm.makeId,
        modelId: productForm.modelId,
        yearId: productForm.yearId,
        meta_title: productForm.meta_title,
        meta_description: productForm.meta_description,
        meta_keywords: productForm.meta_keywords,
        subcategorySlug: productForm.subcategorySlug,
      };


      console.log("Product data being sent to API:", productData);

      const response = await fetch(`/api/products/${editProduct.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Update response from API:", data);
        fetchProducts(); // Refresh the product list after updating
        setEditProduct(null); // Clear the edit state
        setProductForm({
          name: '',
          slug: '',
          description: '',
          costprice: '',
          price: '',
          stock: '',
          type: '',
          dtype: '',
          subcategorySlug: '',
          // colors: [],
          // sizes: [],
          discount: '',
          isTopRated: false,
          images: [],
          meta_title: '',
          meta_description: '',
          meta_keywords: '',
        });
        setExistingImages([]); // Clear existing images after update
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear file input
        }
        toast.success("Product updated successfully!");
      } else {
        const errorData = await response.json();
        console.error('Failed to update product:', errorData);
        toast.error("Failed to update product.");
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("An error occurred while updating the product.");
    }
    setIsLoading(false);
  };


  const handleCancelEdit = () => {
    setEditProduct(null);
    setProductForm({
      name: '',
      slug: '', // Reset slug after cancel
      description: '',
      costprice: '',
      price: '',
      stock: '',
      type: '',
      dtype: '',
      subcategorySlug: '',
      // colors: [],
      // sizes: [],
      discount: '',
      isTopRated: false,
      images: [],
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("New images selected for upload:", files.map(file => file.name)); // Log the selected images
    setProductForm((prevForm) => ({
      ...prevForm,
      images: [...prevForm.images, ...files],
    }));
  };

  const handleRemoveExistingImage = (index) => {
    console.log("Removing existing image at index:", index, existingImages[index]);
    setExistingImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  const handleRemoveImage = (index) => {
    console.log("Removing newly added image at index:", index, productForm.images[index].name); // Log the image being removed
    setProductForm((prevForm) => ({
      ...prevForm,
      images: prevForm.images.filter((_, i) => i !== index),
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <ToastContainer />
      {/* Confirmation Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white  rounded-lg shadow-lg w-[99%] max-w-md p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              If you delete this product, all orders related to this product
              will also be deleted. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 bg-[#FF0000] text-white rounded-md hover:bg-red-700 focus:outline-none"
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Products List
          </h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => router.push('/admin/pages/add-product')}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        {isSearchVisible && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[50px]">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Image</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Slug</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">DType</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Stock</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Updated At</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredData) &&
                filteredData.map((item, index) => (
                  <tr key={item.slug} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0].url.startsWith('https://')
                            ? item.images[0].url
                            : `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${item.images[0].url}`}
                          alt="Product Image"
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-normal text-sm font-medium text-gray-900">{item.slug}</td>
                    <td className="px-4 py-4 whitespace-normal text-sm font-medium text-gray-900">{item.dtype}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 overflow-hidden text-ellipsis">{item.description}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.stock}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.updatedAt).toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                      >
                        Edit
                      </button>
                      {userRole === 'INVENTORYMANAGER' ? (
                        <></>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(item.slug)}
                          className="text-[#FF0000] hover:text -red-900 transition duration-150 ease-in-out"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>


      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[90vh] overflow-auto">
            <h2 className="text-xl mb-4">Edit Product</h2>
            <form onSubmit={handleFormSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={productForm.slug}
                  onChange={(e) => {
                    const updatedSlug = e.target.value.replace(/\s+/g, '-'); // Replace spaces with dashes
                    setProductForm({ ...productForm, slug: updatedSlug });
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <ReactQuill
                  value={productForm.description}
                  onChange={(value) =>
                    setProductForm({ ...productForm, description: value })
                  }
                />
              </div>
              {/* cost price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Cost Price
                </label>
                <input
                  type="number"
                  name="costprice"
                  value={productForm.costprice}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Make</label>
                <Select
                  value={makes.find(make => make.value === productForm.makeId)}
                  onChange={(selected) =>
                    setProductForm({ ...productForm, makeId: selected.value })
                  }
                  options={makes}
                  placeholder="Select Make"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <Select
                  value={models.find(model => model.value === productForm.modelId)}
                  onChange={(selected) =>
                    setProductForm({ ...productForm, modelId: selected.value })
                  }
                  options={filteredModels}
                  placeholder="Select Model"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <Select
                  value={years.find(year => year.value === productForm.yearId)}
                  onChange={(selected) =>
                    setProductForm({ ...productForm, yearId: selected.value })
                  }
                  options={years}
                  placeholder="Select Year"
                />
              </div>


              {/* Stock */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={productForm.stock !== null ? productForm.stock.toString() : ''}
                  min="0"
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={productForm.type || 'New'}
                  onChange={(e) => {
                    setProductForm({ ...productForm, type: e.target.value });
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
                  value={productForm.dtype}
                  onChange={(e) => {
                    setProductForm({ ...productForm, dtype: e.target.value });
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" >Select DType</option> {/* Changed to empty string for better handling */}
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>


              {/* Discount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Discount
                </label>
                <input
                  type="number"
                  name="discount"
                  value={productForm.discount ? productForm.discount.toFixed(2) : ''}
                  step="0.01"
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      discount: roundToTwoDecimalPlaces(parseFloat(e.target.value) || 0),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Top Rated */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Top Rated
                </label>
                <input
                  type="checkbox"
                  name="isTopRated"
                  checked={productForm.isTopRated}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Popular Checkbox */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Popular</label>
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={productForm.isPopular}
                  onChange={(e) =>
                    setProductForm({ ...productForm, isPopular: e.target.checked })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Featured</label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={productForm.isFeatured}
                  onChange={(e) =>
                    setProductForm({ ...productForm, isFeatured: e.target.checked })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


              {/* Subcategory */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  name="subcategorySlug"
                  value={productForm.subcategorySlug}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subcategory</option>
                  {filteredSubcategories.map((subcat) => (
                    <option key={subcat.id} value={subcat.slug}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Colors */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Colors
                </label>
                <Select
                  isMulti
                  name="colors"
                  value={productForm.colors}
                  onChange={(selected) =>
                    setProductForm({ ...productForm, colors: selected })
                  }
                  options={colors.map((color) => ({
                    value: color.id,
                    label: `${color.name} (${color.hex})`,
                    hex: color.hex,
                  }))}
                  getOptionLabel={(color) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          backgroundColor: color.hex,
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: '10px',
                        }}
                      ></span>
                      {color.label}
                    </div>
                  )}
                />
              </div> */}

              {/* Selected Colors Display */}
              {/* {productForm.colors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">Selected Colors</h4>
                  <div className="flex space-x-2">
                    {productForm.colors.map((color, index) => (
                      <div key={index} className="relative">
                        <span
                          style={{
                            backgroundColor: color.hex,
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '10px',
                          }}
                        ></span>
                        <span>{color.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Sizes */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sizes
                </label>
                <Select
                  isMulti
                  name="sizes"
                  value={productForm.sizes}
                  onChange={(selected) =>
                    setProductForm({ ...productForm, sizes: selected })
                  }
                  options={sizes.map((size) => ({
                    value: size.id,
                    label: size.name,
                  }))}
                />
              </div> */}

              {/* Meta Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={productForm.meta_title}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Meta Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={productForm.meta_description}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Meta Keywords */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={productForm.meta_keywords}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Images
                </label>
                <input
                  type="file"
                  name="images"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  multiple
                />
              </div>

              {/* Existing Images */}
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Existing Images</h4>
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${img}`} // Prepend base URL
                          alt={`Product Image ${index}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-1 right-1 bg-[#FF0000] text-white rounded-full p-1"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* New Images Preview */}
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">New Images</h4>
                {productForm.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productForm.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`New Product Image ${index}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-[#FF0000] text-white rounded-full p-1"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={isLoading} // Disable the button while submitting
                >
                  {isLoading ? 'Loading...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;
