export const headerStyles = `
  .basic-header {
    width: 100%;
    background-color: white;
    border-bottom: 1px solid #eaeaea;
    padding: 1rem 0;
  }

  .header-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .header-left {
    flex: 0 0 auto;
  }

  .logo-placeholder {
    background-color: #f3f4f6;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: bold;
    color: #6b7280;
  }

  .header-nav {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .nav-list {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }

  .nav-link {
    color: #4b5563;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: #2563eb;
  }

  .header-right {
    flex: 0 0 auto;
  }

  .auth-button {
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 0.375rem;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .auth-button:hover {
    background-color: #1d4ed8;
  }
`
