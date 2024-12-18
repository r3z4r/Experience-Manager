export const CartItemsStyles = `
 {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

.container{
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-checkout-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.cart-container {
  width: 700px;
  background-color: #fff;
  margin: 5px auto;
}

/* Cart Card */
.cart-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
}

.cart-item {
  display: flex;
  flex-direction: row;
}

.product-img {
  width: 80px;
  height: 50px;
  object-fit: cover;
  margin-right: 15px;
}

.item-details {
  flex: 1;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.price {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.product-info,
.product-color,
.product-capacity,
.payment-method {
  font-size: 0.9rem;
}

.vat-container {
  display: flex;
  justify-content: flex-end; 
  margin-top: 10px; 
}

.vat-paragraph {
  font-size: 0.9rem;
  color: #666;
}

.bold-text {
  font-weight: bold;
  color: #000;
}

.icons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.edit-icon,
.delete-icon {
  font-size: 1rem;
  cursor: pointer;
  color: #ff4d4f;
  transition: color 0.3s ease;
}

.edit-icon:hover,
.delete-icon:hover {
  color: #d32f2f;
}

.vat-info,
.vat {
  font-size: 0.8rem;
  color: #777;
}

.checkout-box {
    background-color: #f7f7f7;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 5px;
    height:220px;
    margin-top:5px;
    margin-left:30px
}

.checkout-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
}

.checkout-list {
    list-style: none;
    font-size: 14px;
    color: #555;
    margin-bottom: 20px;
}

.checkout-list li {
    margin-bottom: 5px;
}

.pay-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
}

.payment-logos {
    display: flex;
    gap: 10px;
}

.pay-logo {
    width: 40px;
    height: auto;
}

`
