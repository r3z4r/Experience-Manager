export const navbarStyles = `
  .navbar {
    position: relative;
    z-index: 50;
    padding: 0.5rem 1rem;
  }

  .navbar-light {
    background: #ffffff;
  }

  .navbar-dark {
    background: #111827;
  }

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 5rem;
  }

  .navbar-logo {
    flex-shrink: 0;
  }

  .navbar-logo img {
    height: 3rem;
    width: auto;
  }

  .navbar-links {
    display: none;
  }

  .navbar-actions {
    display: none;
  }

  .navbar-link {
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.2s;
    text-decoration: none;
    padding: 0.5rem 1rem;
  }

  .navbar-light .navbar-link {
    color: #1f2937;
  }

  .navbar-dark .navbar-link {
    color: #ffffff;
  }

  .navbar-link:hover {
    color: #3b82f6;
  }

  .navbar-button {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background: #3b82f6;
    color: #ffffff;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .navbar-button:hover {
    background: #2563eb;
  }

  .navbar-mobile-menu {
    display: block;
  }

  @media (min-width: 768px) {
    .navbar-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .navbar-mobile-menu {
      display: none;
    }
  }
`
