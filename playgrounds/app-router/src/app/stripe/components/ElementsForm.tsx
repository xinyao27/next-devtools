'use client'

import * as React from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { formatAmountForDisplay } from '@/utils/stripe-helpers'
import * as config from '@/config'
import getStripe from '@/utils/get-stripejs'
import { createPaymentIntent } from '@/app/stripe/actions/stripe'
import StripeTestCards from './StripeTestCards'
import CustomDonationInput from './CustomDonationInput'
import type { StripeError } from '@stripe/stripe-js'

function CheckoutForm(): JSX.Element {
  const [input, setInput] = React.useState<{
    customDonation: number
    cardholderName: string
  }>({
    customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
    cardholderName: '',
  })
  const [paymentType, setPaymentType] = React.useState<string>('')
  const [payment, setPayment] = React.useState<{
    status: 'initial' | 'processing' | 'error'
  }>({ status: 'initial' })
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const stripe = useStripe()
  const elements = useElements()

  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'processing':
      case 'requires_payment_method':
      case 'requires_confirmation':
        return <h2>Processing...</h2>

      case 'requires_action':
        return <h2>Authenticating...</h2>

      case 'succeeded':
        return <h2>Payment Succeeded 🥳</h2>

      case 'error':
        return (
          <>
            <h2>Error 😭</h2>
            <p className="error-message">{errorMessage}</p>
          </>
        )

      default:
        return null
    }
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    })

    elements?.update({ amount: input.customDonation * 100 })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault()
      // Abort if form isn't valid
      if (!e.currentTarget.reportValidity()) return
      if (!elements || !stripe) return

      setPayment({ status: 'processing' })

      const { error: submitError } = await elements.submit()

      if (submitError) {
        setPayment({ status: 'error' })
        setErrorMessage(submitError.message ?? 'An unknown error occurred')

        return
      }

      // Create a PaymentIntent with the specified amount.
      const { client_secret: clientSecret } = await createPaymentIntent(new FormData(e.target as HTMLFormElement))

      // Use your card Element with other Stripe.js APIs
      const { error: confirmError } = await stripe!.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/stripe/donate-with-elements/result`,
          payment_method_data: {
            billing_details: {
              name: input.cardholderName,
            },
          },
        },
      })

      if (confirmError) {
        setPayment({ status: 'error' })
        setErrorMessage(confirmError.message ?? 'An unknown error occurred')
      }
    } catch (error) {
      const { message } = error as StripeError

      setPayment({ status: 'error' })
      setErrorMessage(message ?? 'An unknown error occurred')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CustomDonationInput
          className="elements-style"
          currency={config.CURRENCY}
          max={config.MAX_AMOUNT}
          min={config.MIN_AMOUNT}
          name="customDonation"
          step={config.AMOUNT_STEP}
          value={input.customDonation}
          onChange={handleInputChange}
        />
        <StripeTestCards />
        <fieldset className="elements-style">
          <legend>Your payment details:</legend>
          {paymentType === 'card' ? (
            <input
              required
              className="elements-style"
              name="cardholderName"
              placeholder="Cardholder name"
              type="Text"
              onChange={handleInputChange}
            />
          ) : null}
          <div className="FormRow elements-style">
            <PaymentElement
              onChange={(e) => {
                setPaymentType(e.value.type)
              }}
            />
          </div>
        </fieldset>
        <button
          className="elements-style-background"
          disabled={!['initial', 'succeeded', 'error'].includes(payment.status) || !stripe}
          type="submit"
        >
          Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
        </button>
      </form>
      <PaymentStatus status={payment.status} />
    </>
  )
}

export default function ElementsForm(): JSX.Element {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        appearance: {
          variables: {
            colorIcon: '#6772e5',
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          },
        },
        currency: config.CURRENCY,
        mode: 'payment',
        amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
      }}
    >
      <CheckoutForm />
    </Elements>
  )
}
