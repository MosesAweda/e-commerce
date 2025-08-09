// components/ProductShowcase.js
import React from 'react';
import ProductCard from './ProductCard';

const ProductShowcase = ({ 
  products,
  title = "Featured Products",
  subtitle = "Discover our latest collection of premium products"
}) => {

  const defaultProducts = [
    {
      id: 1,
      title: "Wireless Bluetooth Headphones Premium Quality Sound",
      description: "High-quality wireless headphones with noise cancellation and premium sound quality for an immersive audio experience.",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      inStock: true
    },
    {
      id: 2,
      title: "Smart Fitness Watch with Health Monitoring",
      description: "Advanced fitness tracking with heart rate monitoring, GPS, and smart notifications.",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      inStock: false // Out of stock for demo
    },
    {
      id: 3,
      title: "Organic Cotton T-Shirt Comfortable Fit",
      description: "Premium organic cotton t-shirt with sustainable materials and comfortable fit for daily wear.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
      inStock: true,
      variants: [
        { id: 'small', name: 'Small', price: 0 },
        { id: 'medium', name: 'Medium', price: 0 },
        { id: 'large', name: 'Large', price: 2 },
        { id: 'xl', name: 'Extra Large', price: 5 }
      ]
    },
  
  
  ];

  const displayProducts = products || defaultProducts;

  const handleBuyNow = (product) => {
    console.log('Buy now:', product);
    window.location.href = `/product/${product.id}`;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h2 className="display-6 fw-bold text-dark">{title}</h2>
          <p className="text-muted">{subtitle}</p>
        </div>
      </div>
      
      <div className="row">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuyNow={handleBuyNow}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;