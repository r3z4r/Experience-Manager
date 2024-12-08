export const cardStyles = `
  .feature-card {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    background: #1a1a1a;
    border-radius: 8px;
    min-height: 300px;
  }

  .feature-card.image-right {
    flex-direction: row;
  }

  .feature-card.image-left {
    flex-direction: row-reverse;
  }

  .feature-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
  }

  .feature-title {
    font-size: 2rem;
    font-weight: bold;
    color: #00ffff;
    margin-bottom: 1.5rem;
  }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .feature-list li {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
  }

  .feature-image {
    flex: 1;
    background-color: #00ffff;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .feature-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .feature-button {
    display: inline-block;
    background: #00ffff;
    color: #1a1a1a;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    margin-top: 1.5rem;
    align-self: flex-start;
    transition: all 0.2s ease;
  }

  .feature-button:hover {
    background: #00e6e6;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .feature-card,
    .feature-card.image-right,
    .feature-card.image-left {
      flex-direction: column;
    }

    .feature-image {
      min-height: 200px;
    }
  }
`
