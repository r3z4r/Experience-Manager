export const footerStyles = `
  .footer {
    background: #1a1a1a;
    color: #ffffff;
    padding: 4rem 0 2rem;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .footer-main {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 4rem;
    margin-bottom: 3rem;
  }

  .footer-brand {
    max-width: 400px;
  }

  .footer-logo {
    height: 40px;
    width: auto;
    margin-bottom: 1.5rem;
  }

  .footer-description {
    color: #a3a3a3;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .social-links {
    display: flex;
    gap: 1rem;
  }

  .social-link {
    color: #ffffff;
    font-size: 1.5rem;
    transition: opacity 0.2s ease;
  }

  .social-link:hover {
    opacity: 0.8;
  }

  .footer-links h3,
  .footer-contact h3 {
    color: #ffffff;
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .footer-links ul {
    list-style: none;
    padding: 0;
  }

  .footer-links li {
    margin-bottom: 0.75rem;
  }

  .footer-links a {
    color: #a3a3a3;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer-links a:hover {
    color: #ffffff;
  }

  .footer-contact p {
    color: #a3a3a3;
    margin-bottom: 0.75rem;
  }

  .footer-bottom {
    border-top: 1px solid #333;
    padding-top: 2rem;
    text-align: center;
    color: #a3a3a3;
  }
`
