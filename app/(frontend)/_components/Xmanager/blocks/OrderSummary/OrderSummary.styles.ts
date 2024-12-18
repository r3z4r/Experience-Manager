export const OrderSummaryStyles = `
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  color: #333;
}

/* Order Summary Section */
.order-summary {
  width: 700px;
  background-color: #fff;
  margin: 5px auto;
}

.order-summary h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.summary-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  padding: 20px;
}

/* Product Row */
.product-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.product-img {
  height: 75px;
  margin-right: 15px;
  margin-top:30px;
  width:60px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 1rem;
  font-weight: bold;
}

.product-subtitle {
  font-size: 0.8rem;
  color: #777;
  margin-top: 5px;
}

.product-price {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

/* Delivery Row */
.delivery-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.delivery-text {
  font-size: 0.9rem;
  color: #333;
  margin-left:75px;
}

.delivery-price {
  font-size: 0.9rem;
}

.strikethrough {
  text-decoration: line-through;
  margin-right: 5px;
  color: #888;
}

.free {
  color: #28a745;
  font-weight: bold;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

/* Separator */
hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 15px 0;
}

`