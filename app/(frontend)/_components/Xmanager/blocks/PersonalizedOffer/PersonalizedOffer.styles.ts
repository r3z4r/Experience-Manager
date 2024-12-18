export const personalizedOfferStyles = `.personalizedOffer {
  max-width: 90%; 
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
  font-family: Arial, sans-serif;
}

.greeting {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.productTitle {
  font-size: 1.25rem;
  color: #000;
  font-weight: bold;
  margin-bottom: 1rem;
}

.offerDescription {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.productImageContainer {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.productImage {
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

.productDetails {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.pricing {
  font-size: 1rem;
  color: #333;
  margin-bottom: 1rem;
}

.originalPrice {
  text-decoration: line-through;
  color: #888;
  font-size: 0.9rem;
}

.bonusOffer {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #555;
}

.buyButton {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.buyButton:hover {
  background-color: #e43e3e;
}
 @media (max-width: 1024px) {
   .greeting {
    font-size: 1.25rem;
  }
  .productTitle {
    font-size: 1.1rem;
  }
  .offerDescription {
    font-size: 0.85rem;
  }
  
}

@media (max-width: 768px) {
  .greeting {
    font-size: 1.25rem;
  }
  .productTitle {
    font-size: 1.1rem;
  }
  .offerDescription {
    font-size: 0.85rem;
  }

}

@media (max-width: 480px) {
  .greeting {
    font-size: 1.1rem;
  }
  .personalizedOffer {
    display: flex;
    flex-direction: column; 
    padding: 1rem;
    position: relative; 
  z-index: 1;
}
  .productTitle {
    font-size: 1rem;
  }
  .offerDescription {
    font-size: 0.85rem;
  }

}
`
