import React from 'react'
import { productCardStyles } from '../ProductCard/ProductCard.styles'

export const ProductsSection: React.FC = () => {
  const products = [
    'API Spec Q1 Certification - Quality Management System for Organizations Providing Products',
    'API Spec Q1 Certification - Quality Management System for Service Supply Organizations',
    'API 18LCM Certification - Product Life Cycle Management System',
    'ISO 9001 Certification',
    'ISO 14001 Certification',
    'API Monogram License',
  ]

  return (
    <>
      <style>{productCardStyles}</style>
      <div className="formContainer">
        <h2 className="heading">Products</h2>
        <p>
          Get Quotes for Licenses<span className="required">*</span>
        </p>
        <div className="checkboxGroup">
          {products.map((product, index) => (
            <div key={index} className="checkboxItem">
              <input type="checkbox" id={`product-${index}`} />
              <label htmlFor={`product-${index}`}>{product}</label>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
