export const productCardStyles = `
  .productCard {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 2rem auto;
    max-width: 300px; 
  }
  
  .cardBrand {
    font-size: 1rem;
    margin: 0.5rem 0;
    color: #555;
  }
  
  .cardName {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0.25rem 0;
  }
  
  .cardPrice {
    font-size: 1rem;
    color: #000;
    font-weight: bold;
  }
  
  .cardImage {
    width: 100%;
    height: auto;
    margin-bottom: 1rem;
    border-radius: 8px; 
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .productCard {
      padding: 1rem;
      margin: 1.5rem auto;
      max-width: 90%; 
    }
    .cardBrand {
      font-size: 0.95rem;
    }
    .cardName {
      font-size: 1rem;
    }
    .cardPrice {
      font-size: 0.95rem;
    }
  }

  @media (max-width: 480px) {
    .productCard {
      padding: 0.75rem;
      margin: 1rem auto; 
    }
    .cardBrand {
      font-size: 0.9rem;
    }
    .cardName {
      font-size: 0.95rem;
    }
    .cardPrice {
      font-size: 0.9rem;
    }
  }
`
