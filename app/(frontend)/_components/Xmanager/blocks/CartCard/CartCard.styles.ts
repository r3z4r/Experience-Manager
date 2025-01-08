export const cardStyles = `
.card {
        padding: 40px;
        border-radius: 10px;
        display: flex;
        gap: 2rem;
        box-shadow: 0px 0px 10px -5px rgba(0, 0, 0, 0.10);
    }

    .card-title {
    font-size: 2rem;
    font-weight: bold;
    color: black;
    margin-bottom: 1.5rem;
    }

    .card-description {
    font-size: 14px;
    }

    .card-subTitle {
    margin-top: 2rem;
        font-size: 1rem;
        font-weight: bold;
        color: black;
    }

    .card-list-item {
         display: flex;
        gap: 2rem;
    }

    .card-list{
        font-size: 12px;
        
    }

.card-image img {
min-width: 100px;
  width: 100%; /* Adjust for responsiveness */
  max-width: 380px; /* Ensure consistent sizing on larger screens */
  height: auto; /* Maintain aspect ratio */
  object-fit: cover;
}

.card-actions {
  width: 100%; /* Ensure it spans the full width */
  display: flex; /* Use flexbox */
  justify-content: flex-end; /* Align the button to the right */
  margin-top: 1.5rem; /* Add some spacing */
}


  .card-button {
  background-color: #1C00C8;
  color: white;
  padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    margin-top: 1.5rem;
    align-self: flex-start;
    transition: all 0.2s ease;
  }

  @media (max-width: 768px) {
    .card,
    .card-list-item,
    .feature-card.image-left {
      flex-direction: column;
    }

    .card-image {
      min-height: 200px;
    }
  }
`
