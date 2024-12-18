export const signinCardStyles = `
  .signin-card {
    background: #ffffff;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    text-align: center;
    margin: auto;
    font-family: Arial, sans-serif;
  }

  .signin-card h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
  }

  .signin-card .input-group {
    margin-bottom: 1rem;
  }

  .signin-card input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .signin-card .forgot-password {
    text-align: right;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .signin-card .forgot-password a {
    color: #ef4444;
    text-decoration: none;
  }

  .signin-card .signin-btn {
    background: #4b5563;
    color: #ffffff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 1rem;
    width: 60%;
  }

  .signin-card .signin-btn:hover {
    background: #374151;
  }

  .signin-card .signup-link {
    font-size: 0.875rem;
    margin-top: 1rem;
  }

  .signin-card .signup-link a {
    color: #ef4444;
    text-decoration: none;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .signin-card {
      padding: 1.5rem;
      max-width: 90%; 
    }

    .signin-card h2 {
      font-size: 1.25rem;
    }

    .signin-card .signin-btn {
      width: 80%;
    }
  }

  @media (max-width: 480px) {
    .signin-card {
      padding: 1rem;
    }

    .signin-card h2 {
      font-size: 1.1rem;
    }

    .signin-card .signin-btn {
      width: 100%; 
    }

    .signin-card .forgot-password {
      font-size: 0.8rem;
    }

    .signin-card .signup-link {
      font-size: 0.8rem;
    }
  }
`
