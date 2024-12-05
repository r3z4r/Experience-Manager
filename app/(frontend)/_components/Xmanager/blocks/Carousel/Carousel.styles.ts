export const carouselStyles = `
  .carousel-section {
    padding: 4rem 0;
    background: #ffffff;
    overflow: hidden;
  }

  .carousel-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .carousel-track {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding: 1rem 0;
  }

  .carousel-track::-webkit-scrollbar {
    display: none;
  }

  .carousel-item {
    flex: 0 0 300px;
    scroll-snap-align: start;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 1rem;
    transition: transform 0.3s ease;
  }

  .carousel-item:hover {
    transform: translateY(-5px);
  }

  .carousel-image {
    margin-bottom: 1rem;
    border-radius: 6px;
    overflow: hidden;
  }

  .carousel-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .carousel-item h3 {
    color: #1a1a1a;
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  .carousel-item p {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
  }
`
