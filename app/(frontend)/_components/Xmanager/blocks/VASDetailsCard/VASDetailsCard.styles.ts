export const VASCardDetailsStyles = `
.vasDetailsCard {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
  max-width: 900px;
  margin: auto;
  box-sizing: border-box;
}

.header {
  margin-bottom: 1rem;
}

.mainTitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.subTitle {
  font-weight: 500;
  color: #000;
  margin: 0.25rem 0 1rem 0;
}

.section {
  color: #666;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.dropdownSection {
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}

.dropdownHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #555;
  font-weight: 500;
}

.chevron {
  transition: transform 0.3s ease;
}

.chevron.rotate {
  transform: rotate(180deg);
}

.dropdownContent {
  margin-top: 1rem;
  color: #444;
  line-height: 1.5;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 600px) {
  .vasDetailsCard {
    padding: 1rem;
  }

  .mainTitle {
    font-size: 1rem;
  }

  .dropdownContent {
    font-size: 0.9rem;
  }
}
`
