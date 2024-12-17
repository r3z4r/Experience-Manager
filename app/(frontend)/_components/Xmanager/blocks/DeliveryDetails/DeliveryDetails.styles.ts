export const DeliveryDetailsStyles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

.delivery-details {
  width: 700px;
  background-color: #fff;
  margin: 5px auto;
}

.details-box {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}

.details-box h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.radio-option input[type="radio"] {
  margin-right: 8px;
  accent-color: red;
}

.address-box {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  line-height: 1.6;
}

.address-box p {
  font-size: 0.9rem;
}

.address-box .address {
  color: #333;
  margin: 10px 0;
}

.edit-link {
  color: #e63946;
  text-decoration: none;
  font-size: 0.9rem;
}

.edit-link:hover {
  text-decoration: underline;
}

  .contact-info {
    .contact-box {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fafafa;

      p {
        margin: 5px 0;
      }

      .icons {
        display: flex;
        gap: 8px;

        .icon-btn {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 18px;
        }

        .edit-btn {
          color: #6c757d;
        }

        .delete-btn {
          color: #e63946;
        }
      }
    }
  }
  .contact-info {
    width: 700px;
    background-color: #fff;
    margin: 5px auto;
}

.contact-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
}

.contact-details p {
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #333;
  margin-top:5px;
}

.contact-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* Space below row */
}

.contact-row .name {
  font-size: 0.9rem;
  color: #333;
}

h3 {
  margin-bottom: 15px; 
}

.icons {
  display: flex;
  gap: 10px;
}

.icons i {
  font-size: 1rem;
  color: #ff6f6f;
  cursor: pointer;
}
}

  `
