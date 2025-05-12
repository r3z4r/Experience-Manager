export const OrderSuccessModalStyles = `
  .order-success-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  }

  .order-success-modal .success-icon {
    width: 64px;
    height: 64px;
    background-color: #4CAF50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: #fff;
    margin-bottom: 24px;
  }

  .order-success-modal h2 {
    color: #3A4556;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 12px 0;
  }

  .order-success-modal p {
    font-size: 14px;
    color: #7B7B7B;
    margin: 4px 0;
    text-align: center;
  }

  .order-success-modal .request-id {
    margin: 16px 0;
    font-size: 16px;
    font-weight: 500;
    color: #2F2F2F;
  }

  .order-success-modal button {
    padding: 8px 24px;
    background-color: #007bff;
    color: #000;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    margin-top: 16px;
  }
`
