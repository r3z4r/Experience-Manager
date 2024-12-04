type BlockTemplate = {
  label: string
  content: string
  category: string
  css?: string
  attributes?: Record<string, string>
}

export const templateBlocks: BlockTemplate[] = [
  {
    label: 'Header',
    category: 'Layout',
    content: `
      <div data-gjs-type="flex-container" class="medical-header">
        <div data-gjs-type="flex-container" class="container">
          <div class="logo-area">
            <img src="/logo.webp" alt="Star Medica Logo" class="logo"/>
          </div>
          <nav data-gjs-type="flex-container" class="main-nav">
            <a href="#" class="nav-link">Home</a>
            <a href="#" class="nav-link">FAQ</a>
            <a href="#" class="nav-link">Contact</a>
          </nav>
          <div data-gjs-type="flex-container" class="auth-area">
            <a href="#" class="login-btn">Login/Register</a>
            <div class="language-selector">
              <span class="flag">🇺🇸</span>
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    `,
    css: `
      .medical-header {
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 1000;
      }
      .medical-header .container {
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .logo { height: 40px; }
      .main-nav {
        gap: 2rem;
      }
      .nav-link {
        color: #2c3e50;
        text-decoration: none;
        font-weight: 500;
      }
      .auth-area {
        align-items: center;
        gap: 1rem;
      }
      .login-btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        background: #00bcd4;
        color: white;
        text-decoration: none;
      }
    `,
  },
  {
    label: 'Hero Carousel',
    category: 'Sections',
    content: `
      <section class="hero-carousel">
        <div class="carousel-container">
          <div class="carousel-slide active">
            <div class="slide-content">
              <div class="text-content">
                <h1>Star Medica</h1>
                <h2>The Digital Transformation</h2>
                <p>Leading the way in modern healthcare solutions</p>
              </div>
              <div class="image-content">
                <img src="/doctor-patient.jpg" alt="Doctor with patient"/>
              </div>
            </div>
          </div>
          <button class="carousel-btn prev">❮</button>
          <button class="carousel-btn next">❯</button>
        </div>
      </section>
    `,
    css: `
      .hero-carousel {
        margin-top: 80px;
        background: linear-gradient(135deg, #f8fbff 0%, #f0f4f8 100%);
      }
      .carousel-container {
        position: relative;
        max-width: 1200px;
        margin: 0 auto;
        height: 500px;
      }
      .carousel-slide {
        height: 100%;
        display: none;
      }
      .carousel-slide.active {
        display: block;
      }
      .slide-content {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 2rem;
      }
      .text-content {
        flex: 1;
        padding-right: 2rem;
      }
      .text-content h1 {
        font-size: 3rem;
        color: #2c3e50;
        margin-bottom: 1rem;
      }
      .text-content h2 {
        font-size: 2rem;
        color: #00bcd4;
        margin-bottom: 1rem;
      }
      .image-content {
        flex: 1;
      }
      .image-content img {
        width: 100%;
        height: auto;
        border-radius: 8px;
      }
      .carousel-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.8);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
      .carousel-btn.prev { left: 10px; }
      .carousel-btn.next { right: 10px; }
    `,
  },
  {
    label: 'Appointment Section',
    category: 'Sections',
    content: `
      <section class="appointment-section">
        <div class="container">
          <div class="appointment-content">
            <div class="text-area">
              <h2>Book Appointment</h2>
              <p>Make an appointment with your preferred doctor or specialist at a time that suits you.</p>
              <button class="book-btn">Book Now</button>
            </div>
            <div class="image-area">
              <img src="/doctor-consultation.jpg" alt="Doctor consultation"/>
            </div>
          </div>
        </div>
      </section>
    `,
    css: `
      .appointment-section {
        padding: 4rem 0;
        background: #f8fbff;
      }
      .appointment-content {
        display: flex;
        align-items: center;
        gap: 4rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }
      .text-area {
        flex: 1;
      }
      .text-area h2 {
        font-size: 2rem;
        color: #2c3e50;
        margin-bottom: 1rem;
      }
      .text-area p {
        color: #666;
        margin-bottom: 2rem;
      }
      .book-btn {
        background: #00bcd4;
        color: white;
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
      }
      .image-area {
        flex: 1;
      }
      .image-area img {
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
    `,
  },
  {
    label: 'Subscription Section',
    category: 'Sections',
    content: `
      <section class="subscription-section">
        <div class="container">
          <div class="subscription-content">
            <div class="subscription-info">
              <h2>Therapy Session</h2>
              <p>Make an appointment with your preferred therapist</p>
              <div class="price">
                <span class="currency">₹</span>
                <span class="amount">300.00</span>
                <span class="period">/Weekly</span>
              </div>
              <ul class="features">
                <li>Package Type: Therapy Session</li>
                <li>Number of sessions: 3</li>
              </ul>
              <p class="note">This plan renews automatically unless cancelled by the user.</p>
              <button class="subscribe-btn">Buy Subscription</button>
            </div>
            <div class="team-image">
              <img src="/medical-team.jpg" alt="Medical Team"/>
            </div>
          </div>
        </div>
      </section>
    `,
    css: `
      .subscription-section {
        padding: 4rem 0;
        background: white;
      }
      .subscription-content {
        display: flex;
        align-items: center;
        gap: 4rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }
      .subscription-info {
        flex: 1;
      }
      .price {
        font-size: 2rem;
        color: #2c3e50;
        margin: 1rem 0;
      }
      .features {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
      }
      .features li {
        padding: 0.5rem 0;
        color: #666;
      }
      .features li:before {
        content: "✓";
        color: #00bcd4;
        margin-right: 0.5rem;
      }
      .subscribe-btn {
        background: #00bcd4;
        color: white;
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 1rem;
      }
      .team-image {
        flex: 1;
      }
      .team-image img {
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
    `,
  },
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
    color: #2c3e50;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
`
