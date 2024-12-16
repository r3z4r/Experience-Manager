import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: Request) {
  try {
    const { amount, currency = 'usd' } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
