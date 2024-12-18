import React, { useState } from 'react'
import { CheckOutPageStyles } from './CheckoutPage.styles'
import { CartItems } from '../CartItems/CartItems'
import { DeliveryDetails } from '../DeliveryDetails/DeliveryDetails'
import { ModeOfPayment } from '../ModeOfPayment/ModeOfPayment'
import { OrderSummary } from '../OrderSummary/OrderSummary'

export function CheckoutPage() {
  return (
    <>
      <style>{CheckOutPageStyles}</style>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Checkout</title>
          <link rel="stylesheet" href="styles.css" />
        </head>
        <body>
          <header className="header">Checkout</header>
          <div className="container">
            <div id="cartitems-card">
              <h2 className="title">Items in Cart</h2>
              <CartItems />
            </div>

            <div id="deliverydetails-card">
            <h2 className="title">Delivery details</h2>
              <DeliveryDetails />
            </div>

            <div id="ordersummary-card">
            <h2 className="title">Order Summary</h2>
              <OrderSummary />
            </div>

            <div id="modeofpayment-card">
            <h2 className="title">Mode of Payment</h2>
              <ModeOfPayment />
            </div>
          </div>
          <div className="button-container">
            <button className="pay-now">Pay Now</button>
          </div>
        </body>
      </html>
    </>
  )
}
