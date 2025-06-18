'use client'

import type Stripe from 'stripe'

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import React, { useState } from 'react'

import { createCheckoutSession } from '@/app/stripe/actions/stripe'
import CustomDonationInput from '@/app/stripe/components/CustomDonationInput'
import StripeTestCards from '@/app/stripe/components/StripeTestCards'
import * as config from '@/config'
import getStripe from '@/utils/get-stripejs'
import { formatAmountForDisplay } from '@/utils/stripe-helpers'

interface CheckoutFormProps {
  uiMode: Stripe.Checkout.SessionCreateParams.UiMode
}

export default function CheckoutForm(props: CheckoutFormProps): JSX.Element {
  const [loading] = useState<boolean>(false)
  const [input, setInput] = useState<{ customDonation: number }>({
    customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
  })
  const [clientSecret, setClientSecret] = useState<null | string>(null)

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e): void =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    })

  const formAction = async (data: FormData): Promise<void> => {
    const uiMode = data.get('uiMode') as Stripe.Checkout.SessionCreateParams.UiMode
    const { client_secret, url } = await createCheckoutSession(data)

    if (uiMode === 'embedded') return setClientSecret(client_secret)

    window.location.assign(url as string)
  }

  return (
    <>
      <form action={formAction}>
        <input
          name="uiMode"
          type="hidden"
          value={props.uiMode}
        />
        <CustomDonationInput
          className="checkout-style"
          currency={config.CURRENCY}
          max={config.MAX_AMOUNT}
          min={config.MIN_AMOUNT}
          name="customDonation"
          onChange={handleInputChange}
          step={config.AMOUNT_STEP}
          value={input.customDonation}
        />
        <StripeTestCards />
        <button
          className="checkout-style-background"
          disabled={loading}
          type="submit"
        >
          Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
        </button>
      </form>
      {clientSecret ? (
        <EmbeddedCheckoutProvider
          options={{ clientSecret }}
          stripe={getStripe()}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : null}
    </>
  )
}
