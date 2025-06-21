// components/AllProductsCards.js
import React from 'react';
import ProductCard from '../../../../components/homepage/ProductCard';

export default function AllProductsCards({ products }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 px-2 md:px-0">
      {products.map((product) => (
        <div key={product.slug} className="">
          <ProductCard
            image={product.images[0].url}
            title={product.name}
            description={product.description}
            price={product.price}
            slug={product.slug}
          />
        </div>
      ))}
    </div>
  );
}
