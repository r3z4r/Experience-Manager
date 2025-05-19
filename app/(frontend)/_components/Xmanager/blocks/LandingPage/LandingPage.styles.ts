export const UaeLandingScreenStyles = `
.uaeScreenContainer {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

.uaeHeader {
  background: linear-gradient(to right, #00732f 25%, #ffffff 25%, #ffffff 50%, #000000 75%, #ef3340 75%);
  color: white;
  padding: 1rem 2rem;
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

.uaeHeroImageWrapper {
  position: relative;
  text-align: center;
}

.uaeHeroImage {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 500px;
  display: block;
}

.uaeHeroTextOverlay {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  padding: 1rem;
}

.uaeHeroTextOverlay h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.uaeHeroTextOverlay p {
  margin-bottom: 1.5rem;
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
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.uaeFeatureIcon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.uaeFeatureCard h3 {
  color: orange;
  margin-bottom: 0.5rem;
}
`
