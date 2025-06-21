'use client'
import React, { useState, useEffect } from 'react';
import FilterableTable from './FilterableTable';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);


  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');

      const data = await response.json();
      console.log("Data of products : ",data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  
  }, []);

  return (
    <FilterableTable
      products={products}
      fetchProducts={fetchProducts}
      categories={categories}
    />
  );
};

export default ProductPage;
