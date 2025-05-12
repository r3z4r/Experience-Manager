export const vasCardStyles = `
.vasCard {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  width: 260px;
  max-width: 100%;
  text-align: center;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 1rem auto;
  box-sizing: border-box;
}

.title {
  font-size: 1rem;
  color: #555;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.25rem 0;
  color: #000;
}

.upfront {
  font-size: 1rem;
  color: #333;
  margin-bottom: 1rem;
}

.cardFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.compare {
  font-size: 0.9rem;
  color: #000;
  cursor: pointer;
}

.addToCart {
  border: 2px solid #0066ff;
  background: transparent;
  color: #000;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.addToCart:hover {
  background-color: #0066ff;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .vasCard {
    padding: 1rem;
    width: 90%;
  }

  .cardFooter {
    flex-direction: column;
    gap: 0.75rem;
  }

  .addToCart, .compare {
    width: 100%;
    text-align: center;
  }
}
`
