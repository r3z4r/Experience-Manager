export const serviceCardStyles = `
  .service-card {
    background: #ffffff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s ease;
    max-width: 350px;
  }

  .service-card:hover {
    transform: translateY(-5px);
  }

  .service-image {
    margin-bottom: 1rem;
    border-radius: 6px;
    overflow: hidden;
  }

  .service-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .service-card:hover .service-image img {
    transform: scale(1.05);
  }

  .service-card h3 {
    color: #1a1a1a;
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  .service-card p {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .service-btn {
    background: #2563eb;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .service-btn:hover {
    background: #1d4ed8;
  }
`
