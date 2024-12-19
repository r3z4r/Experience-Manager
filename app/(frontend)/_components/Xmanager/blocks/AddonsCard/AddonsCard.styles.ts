export const addonsCardStyles = `
.addonsSection {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1rem;
  background-color: #FFFFFF;
}

.contentsContainer {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: 100%;
  background-color: #FFFFFF;
  padding: 1rem;
}

.subContainer {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.addonsSectionTitle {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.cardsContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.cardImage {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.cardTitle {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.cardDescription {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
}

.addToCartButton {
  background-color: #ff3366;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.addToCartButton:hover {
  background-color: #e62e5b;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .card {
    width: 45%; /* Adjust the card size for medium screens */
  }
}

@media (max-width: 768px) {
  .addonsSection {
    padding: 1rem; /* Adjust padding for tablets */
  }

  .cardsContainer {
    justify-content: center;
  }
    .subContainer {
    flex-direction: column;
    }

  .card {
    width: 100%; /* Stack cards on smaller screens */
    margin: 0.5rem 0; /* Adjust margins for stacked layout */
  }

  .cardTitle {
    font-size: 1rem; /* Smaller font size for mobile */
  }

  .cardDescription {
    font-size: 0.8rem; /* Smaller description text */
  }

  .addToCartButton {
    width: 100%; /* Full-width button for smaller screens */
  }
}

@media (max-width: 480px) {
  .addonsSection {
    padding: 0.5rem;
  }

  .cardsContainer {
    flex-direction: column; /* Stack cards vertically for small screens */
    gap: 0.5rem; /* Reduce gap between cards */
  }
    .subContainer {
    flex-direction: column;
    }

  .card {
    width: 100%; /* Ensure card is full width on small screens */
  }

  .cardImage {
    width: 60px; /* Reduce image size on small screens */
    height: 60px;
  }

  .cardTitle {
    font-size: 0.9rem; /* Reduce title size further */
  }

  .cardDescription {
    font-size: 0.75rem; /* Reduce description size further */
  }

  .addToCartButton {
    padding: 0.4rem 0.8rem; /* Adjust button size for small screens */
  }
}
`
