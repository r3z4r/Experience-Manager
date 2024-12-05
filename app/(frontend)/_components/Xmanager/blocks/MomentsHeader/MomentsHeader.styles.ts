export const momentsHeaderStyles = `
  .moments-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
  }

  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo-wrapper {
    flex: 0 0 auto;
  }

  .logo {
    height: 40px;
    width: auto;
  }

  .nav-menu {
    display: flex;
    gap: 2rem;
    margin: 0 2rem;
  }

  .nav-link {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    transition: color 0.2s;
  }

  .nav-link:hover {
    color: #0066cc;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .login-button {
    background: #0066cc;
    color: white;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .login-button:hover {
    background: #0056b3;
  }

  .language-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
`
