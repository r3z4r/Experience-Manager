export const statisticsStyles = `
  .statistics-block {
    padding: 2rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
  
  .stat-item {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 0.5rem;
    text-align: center;
    transition: transform 0.2s ease;
  }
  
  .stat-item:hover {
    transform: translateY(-4px);
  }
  
  .percentage {
    font-size: 2.5rem;
    font-weight: bold;
    color: #00ffff;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  
  .description {
    color: white;
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .statistics-block {
      padding: 1rem;
    }
  }
`
