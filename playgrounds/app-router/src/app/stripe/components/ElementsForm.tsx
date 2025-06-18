'use client'

import type { StripeError } from '@stripe/stripe-js'

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import * as React from 'react'

import { createPaymentIntent } from '@/app/stripe/actions/stripe'
import * as config from '@/config'
import getStripe from '@/utils/get-stripejs'
import { formatAmountForDisplay } from '@/utils/stripe-helpers'

import CustomDonationInput from './CustomDonationInput'
import StripeTestCards from './StripeTestCards'

export default function ElementsForm(): JSX.Element {
  return (
    <Elements
      options={{
        amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
        appearance: {
          variables: {
            colorIcon: '#6772e5',
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          },
        },
        currency: config.CURRENCY,
        mode: 'payment',
      }}
      stripe={getStripe()}
    >
      <CheckoutForm />
    </Elements>
  )
}

function CheckoutForm(): JSX.Element {
  const [input, setInput] = React.useState<{
    cardholderName: string
    customDonation: number
  }>({
    cardholderName: '',
    customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
  })
  const [paymentType, setPaymentType] = React.useState<string>('')
  const [payment, setPayment] = React.useState<{
    status: 'error' | 'initial' | 'processing'
  }>({ status: 'initial' })
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const stripe = useStripe()
  const elements = useElements()

  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'error':
        return (
          <>
            <h2>Error 😭</h2>
            <p className="error-message">{errorMessage}</p>
          </>
        )
      case 'processing':
      case 'requires_confirmation':
        break

      case 'requires_action':
        return <h2>Authenticating...</h2>

      case 'requires_payment_method':
        return <h2>Processing...</h2>

      case 'succeeded':
        return <h2>Payment Succeeded 🥳</h2>

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
        clientSecret,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: input.cardholderName,
            },
          },
          return_url: `${window.location.origin}/stripe/donate-with-elements/result`,
        },
        elements,
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
          onChange={handleInputChange}
          step={config.AMOUNT_STEP}
          value={input.customDonation}
        />
        <StripeTestCards />
        <fieldset className="elements-style">
          <legend>Your payment details:</legend>
          {paymentType === 'card' ? (
            <input
              className="elements-style"
              name="cardholderName"
              onChange={handleInputChange}
              placeholder="Cardholder name"
              required
              type="Text"
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
          disabled={!['error', 'initial', 'succeeded'].includes(payment.status) || !stripe}
          type="submit"
        >
          Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
        </button>
      </form>
      <PaymentStatus status={payment.status} />
    </>
  )
}
