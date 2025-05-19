export const UaeLandingScreenStyles = `
.uaeScreenContainer {
  font-family: sans-serif;
}

.uaeHeader {
  background: linear-gradient(to right, orange, green);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.uaeLogo {
  font-size: 1.5rem;
  font-weight: bold;
}

.uaeCountryLabel {
  font-weight: 500;
}

.uaeHeroSection {
  background-image: url('/xpm/images/LandingPageUAE.png');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 5rem 2rem;
  text-align: center;
}

.uaeHeroSection h1 {
  font-size: 2rem;
  font-weight: bold;
}

.uaeHeroSection p {
  margin: 1rem 0;
}

.uaeSimButton {
  background-color: #FFA500;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: bold;
  color: #000;
  border: none;
  cursor: pointer;
}

.uaeFeatures {
  background: #f9f9f9;
  padding: 3rem 2rem;
  text-align: center;
}

.uaeFeatureGrid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.uaeFeatureCard {
  width: 200px;
}

.uaeFeatureIcon {
  font-size: 2rem;
}

.uaeFeatureCard h3 {
  color: orange;
}
`
