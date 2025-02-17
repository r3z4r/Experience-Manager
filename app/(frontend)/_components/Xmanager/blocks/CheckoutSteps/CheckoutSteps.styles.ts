export const checkoutStepsStyles = `
  .checkout-steps {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .step {
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background: #ffffff;
  }

  .step-checkbox {
    display: none;
  }

  .step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    background: #ffffff;
    cursor: pointer;
    user-select: none;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .step-number {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e5e7eb;
    color: #4b5563;
    border-radius: 9999px;
    font-weight: 600;
  }

  .step.active .step-number {
    background: #3b82f6;
    color: #ffffff;
  }

  .step.completed .step-number {
    background: #10b981;
    color: #ffffff;
  }

  .step-info {
    flex: 1;
  }

  .step-title {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .step-description {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .toggle-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #6b7280;
    transition: transform 0.2s ease;
  }

  .step-content {
    display: none;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    padding: 1.5rem;
    min-height: 100px;
  }

  /* Checkbox-based toggle functionality */
  .step-checkbox:checked + .step-header + .step-content {
    display: block;
  }

  .step-checkbox:checked + .step-header .toggle-icon {
    transform: rotate(180deg);
  }

  /* Active state styles */
  .step.active {
    border-color: #3b82f6;
  }

  .step.active .step-title {
    color: #3b82f6;
  }

  /* Completed state styles */
  .step.completed .step-title {
    color: #10b981;
  }

  .step-content-placeholder {
    text-align: center;
    color: #9ca3af;
    padding: 2rem;
    border: 2px dashed #e5e7eb;
    border-radius: 0.375rem;
  }

  /* Hover states */
  .step-header:hover {
    background: #f9fafb;
  }

  .step-header:hover .toggle-icon {
    color: #3b82f6;
  }
`
