'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'sonner'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  clientSecret: string
  onSuccess?: () => void
}

function CheckoutForm({ onSuccess }: { onSuccess?: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message)
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful')
        onSuccess?.()
      }
    } catch (error) {
      toast.error('Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

export function PaymentForm({ clientSecret, onSuccess }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  )
}
