export const defaultTemplate = {
  html: `
    <header class="header">
      <div class="logo">
        <img src="/logo.png" alt="Moments Logo"/>
      </div>
      <nav class="nav">
        <a href="#" class="nav-link">Home</a>
        <a href="#" class="nav-link">FAQ</a>
        <a href="#" class="nav-link">Contact</a>
      </nav>
      <div class="auth">
        <a href="#" class="login">Login/Register</a>
        <div class="language">
          <span class="flag">🇺🇸</span>
          <span>English (US)</span>
        </div>
      </div>
    </header>

    <section class="appointment-section">
      <div class="container">
        <div class="content-wrapper">
          <div class="text-content">
            <h2>Book Appointment</h2>
            <p>Make an appointment with your preferred doctor or specialist at a time that suits you.</p>
            <button class="cta-button">Book Now</button>
          </div>
          <div class="image-content">
            <img src="/doctor-patient.jpg" alt="Doctor consultation"/>
          </div>
        </div>
      </div>
    </section>

    <section class="subscription-section">
      <div class="container">
        <h2>Buy Subscription</h2>
        <!-- Subscription content -->
      </div>
    </section>

    <section class="news-section">
      <div class="container">
        <h2>News and Events</h2>
        <!-- News content -->
      </div>
    </section>

    <section class="certifications-section">
      <div class="container">
        <h2>Certifications, Recognitions and Affiliations</h2>
        <p>Our priority is to provide quality and safety. We support these actions with recognitions and certifications that guarantee our service of excellence.</p>
      </div>
    </section>
  `,
  css: `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      text-decoration: none;
      color: #333;
    }

    .auth {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .appointment-section {
      background: #f8fbff;
      padding: 4rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .content-wrapper {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .text-content {
      flex: 1;
    }

    .image-content {
      flex: 1;
    }

    .cta-button {
      background: #00bcd4;
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .certifications-section {
      background: #f8fbff;
      padding: 4rem 0;
      text-align: center;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  `,
};
