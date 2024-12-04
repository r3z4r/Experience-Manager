type BlockTemplate = {
  label: string
  category: string
  content: string
  css?: string
  attributes?: Record<string, string>
  media?: string
}

export const templateBlocks: BlockTemplate[] = [
  {
    label: 'Header',
    category: 'Layout',
    content: `
      <header class="moments-header">
        <div class="header-container">
          <div class="logo-wrapper">
            <img src="/logo.webp" alt="Moments Healthcare" class="logo"/>
          </div>
          <nav class="nav-menu">
            <a href="/" class="nav-link">Home</a>
            <a href="/faq" class="nav-link">FAQ</a>
            <a href="/contact" class="nav-link">Contact</a>
          </nav>
          <div class="header-actions">
            <button class="login-button">Login/Register</button>
            <div class="language-selector">
              <span>🇬🇧</span>
              <span>English (UK)</span>
            </div>
          </div>
        </div>
      </header>
    `,
    css: `
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
      }
    `,
  },
  {
    label: 'Hero Banner',
    category: 'Sections',
    content: `
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <h1>Healthcare Made Simple</h1>
            <p class="hero-subtitle">Access quality healthcare services anytime, anywhere</p>
            <div class="hero-cta">
              <button class="primary-button">Book Appointment</button>
              <button class="secondary-button">Learn More</button>
            </div>
          </div>
          <div class="hero-image">
            <img src="https://moments-healthcare.tecnotree.com/assets/images/banner/banner1.jpg" alt="Healthcare Services"/>
          </div>
        </div>
      </section>
    `,
    css: `
      .hero-section {
        padding: 8rem 0 4rem;
        background: linear-gradient(135deg, #f8fbff 0%, #f0f4f8 100%);
      }

      .hero-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        gap: 4rem;
      }

      .hero-content {
        flex: 1;
      }

      .hero-content h1 {
        font-size: 3.5rem;
        color: #1a1a1a;
        margin-bottom: 1.5rem;
        line-height: 1.2;
      }

      .hero-subtitle {
        font-size: 1.25rem;
        color: #666;
        margin-bottom: 2rem;
      }

      .hero-cta {
        display: flex;
        gap: 1rem;
      }

      .hero-image {
        flex: 1;
      }

      .hero-image img {
        width: 100%;
        height: auto;
        border-radius: 8px;
      }
    `,
  },
  {
    label: 'Service Card',
    category: 'Components',
    content: `
      <div class="service-card">
        <div class="service-image">
          <img src="https://moments-healthcare.tecnotree.com/assets/images/services/consultation.jpg" alt="Service"/>
        </div>
        <h3>Online Consultation</h3>
        <p>Connect with healthcare professionals from the comfort of your home</p>
        <button class="service-btn">Book Now</button>
      </div>
    `,
    css: `
      .service-card {
        background: #ffffff;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        text-align: center;
        transition: transform 0.3s ease;
      }

      .service-card:hover {
        transform: translateY(-5px);
      }

      .service-image {
        margin-bottom: 1rem;
      }

      .service-image img {
        width: 100%;
        height: auto;
        border-radius: 4px;
      }

      .service-card h3 {
        font-size: 1.5rem;
        color: #1a1a1a;
        margin-bottom: 0.5rem;
      }

      .service-card p {
        color: #666;
        margin-bottom: 1.5rem;
      }

      .service-btn {
        background: #0066cc;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
      }
    `,
  },
  {
    label: 'Modern Header',
    category: 'Layout',
    content: `
      <header class="modern-header">
        <div class="header-container">
          <div class="header-left">
            <div class="logo-wrapper">
              <img src="/logo.webp" alt="Moments Healthcare" class="logo"/>
            </div>
            <nav class="nav-menu">
              <a href="/" class="nav-link">Home</a>
              <a href="/services" class="nav-link">Services</a>
              <a href="/about" class="nav-link">About</a>
              <a href="/contact" class="nav-link">Contact</a>
            </nav>
          </div>
          <div class="header-right">
            <button class="login-button">Login/Register</button>
            <div class="language-selector">
              <span>🇺🇸</span>
              <select class="lang-select">
                <option value="en">English (US)</option>
              </select>
            </div>
          </div>
        </div>
      </header>
    `,
    css: `
      .modern-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1000;
        padding: 0.75rem 0;
      }

      .header-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 3rem;
        flex: 1;
      }

      .logo-wrapper {
        flex-shrink: 0;
      }

      .logo {
        height: 40px;
        width: auto;
      }

      .nav-menu {
        display: flex;
        align-items: center;
        gap: 2rem;
        flex-wrap: nowrap;
      }

      .nav-link {
        color: #374151;
        text-decoration: none;
        font-weight: 500;
        font-size: 1rem;
        transition: color 0.2s;
        white-space: nowrap;
      }

      .nav-link:hover {
        color: #2563eb;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex-shrink: 0;
      }

      .login-button {
        background: #2563eb;
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        white-space: nowrap;
      }

      .login-button:hover {
        background: #1d4ed8;
      }

      .language-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
      }

      .lang-select {
        border: none;
        background: transparent;
        font-size: 0.875rem;
        color: #374151;
        cursor: pointer;
      }
    `,
  },
  // Add more blocks as needed...
]

export const commonStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    overflow-x: hidden;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: inherit;
  }

  [data-gjs-type="wrapper"] {
    min-height: 100vh;
    width: 100%;
  }

  [data-gjs-type="header"] {
    width: 100%;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
`
