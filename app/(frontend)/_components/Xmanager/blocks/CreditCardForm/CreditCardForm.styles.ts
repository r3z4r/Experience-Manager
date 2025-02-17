export const creditCardFormStyles = `
  .card-application {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .form-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2rem;
  }

  .form-section {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-field label {
    font-weight: 500;
    color: #4b5563;
  }

  .form-field input,
  .form-field select {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-field input:focus,
  .form-field select:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px #3b82f6;
  }

  .submit-button {
    width: 100%;
    padding: 0.875rem;
    background: #3b82f6;
    color: #ffffff;
    font-weight: 600;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-button:hover {
    background: #2563eb;
  }

  @media (min-width: 640px) {
    .form-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`
