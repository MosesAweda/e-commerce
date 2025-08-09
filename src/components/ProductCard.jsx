// components/ProductCard.js
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";
import { ShoppingCartIcon, HeartIcon } from './icons'

const ProductCard = ({ 
  product, 
  onBuyNow,
  className = ""
}) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants ? product.variants[0] : null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const dispatch = useDispatch();
  
  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  // Function to check if product already exists in localStorage cart
  const isProductInCart = (productToCheck) => {
    try {
      const cartData = localStorage.getItem('cart');
      if (!cartData) return false;
      
      const cart = JSON.parse(cartData);
      
      // Check if product exists in cart
      const existingProduct = cart.find(item => {
        // If product has variants, check both id and selected variant
        if (productToCheck.selectedVariant && item.selectedVariant) {
          return item.id === productToCheck.id && 
                 item.selectedVariant.id === productToCheck.selectedVariant.id;
        }
        // For products without variants, just check id
        return item.id === productToCheck.id;
      });
      
      return !!existingProduct;
    } catch (error) {
      console.error('Error checking cart in localStorage:', error);
      return false;
    }
  };

  const handleAddToCart = () => {
    if (product.inStock) {
      const productWithVariant = selectedVariant 
        ? { ...product, selectedVariant }
        : product;
      
      // Check if product already exists in cart
      if (isProductInCart(productWithVariant)) {
        toast.error(`${product.title} is already in your cart!`);
        return;
      }
      
      addProduct(productWithVariant);
      toast.success(`${product.title} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product.inStock && onBuyNow) {
      const productWithVariant = selectedVariant 
        ? { ...product, selectedVariant }
        : product;
      onBuyNow(productWithVariant);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className={`col-lg-4 col-md-6 col-sm-6 col-12 mb-4 ${className}`}>
      <div className={`card h-100 shadow-sm border-0 product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
        {/* Image Container */}
        <div className="position-relative overflow-hidden" style={{ height: '280px' }}>
          {imageLoading && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <img
            className="card-img-top w-100 h-100 object-fit-cover"
            src={product.image}
            alt={product.title}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            style={{ 
              transition: 'transform 0.3s ease',
              opacity: imageLoading ? 0 : 1
            }}
          />
          
          {/* Wishlist Button */}
          <button 
            className={`btn btn-sm position-absolute top-0 end-0 m-2 border-0 ${
              isWishlisted ? 'btn-danger' : 'btn-outline-light'
            }`}
            onClick={toggleWishlist}
            style={{ 
              backgroundColor: isWishlisted ? '#dc3545' : 'rgba(255, 255, 255, 0.9)',
              color: isWishlisted ? 'white' : '#6c757d'
            }}
          >
            <HeartIcon filled={isWishlisted} />
          </button>

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="position-absolute top-0 start-0 m-2">
              <span className="badge bg-danger">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column p-3">
          {/* Product Title */}
          <h6 className="card-title fw-semibold mb-2" style={{ 
            fontSize: '1rem',
            lineHeight: '1.4',
            height: '2.8rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.title}
          </h6>

          {/* Product Description */}
          <p className="card-text text-muted small mb-3" style={{
            height: '3rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.description}
          </p>

          {/* Variants Dropdown */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-3">
              <label className="form-label small text-muted mb-1">Variant:</label>
              <select 
                className="form-select form-select-sm"
                value={selectedVariant?.id || ''}
                onChange={(e) => {
                  const variant = product.variants.find(v => v.id === e.target.value);
                  setSelectedVariant(variant);
                }}
                disabled={!product.inStock}
              >
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name} {variant.price && `(+${variant.price})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price */}
          <div className="mb-3 mt-auto">
            <h5 className="text-primary fw-bold mb-0">
              ${product.price}
              {selectedVariant?.price && (
                <small className="text-muted"> + ${selectedVariant.price}</small>
              )}
            </h5>
          </div>

          {/* Action Buttons */}
          <div className="d-grid gap-2">
            {product.inStock ? (
              <>
                <button
                  className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
                <button
                  className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCartIcon />
                  Add to Cart
                </button>
              </>
            ) : (
              <button className="btn btn-secondary btn-sm" disabled>
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .product-card.out-of-stock {
          opacity: 0.7;
        }
        
        .product-card img:hover {
          transform: scale(1.05);
        }
        
        .object-fit-cover {
          object-fit: cover;
        }
        
        @media (max-width: 768px) {
          .product-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;