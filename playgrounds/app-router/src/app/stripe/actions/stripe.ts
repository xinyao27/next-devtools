'use server'

import type { Stripe } from 'stripe'

import { headers } from 'next/headers'

import { CURRENCY } from '@/config'
import { stripe } from '@/lib/stripe'
import { formatAmountForStripe } from '@/utils/stripe-helpers'

export async function createCheckoutSession(
  data: FormData,
): Promise<{ client_secret: null | string; url: null | string }> {
  const ui_mode = data.get('uiMode') as Stripe.Checkout.SessionCreateParams.UiMode

  const origin: string = (await headers()).get('origin') as string

  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: 'Custom amount donation',
          },
          unit_amount: formatAmountForStripe(Number(data.get('customDonation') as string), CURRENCY),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    submit_type: 'donate',
    ...(ui_mode === 'hosted' && {
      cancel_url: `${origin}/stripe/donate-with-checkout`,
      success_url: `${origin}/stripe/donate-with-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
    }),
    ...(ui_mode === 'embedded' && {
      return_url: `${origin}/stripe/donate-with-embedded-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
    }),
    ui_mode,
  })

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  }
}

export async function createPaymentIntent(data: FormData): Promise<{ client_secret: string }> {
  const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(Number(data.get('customDonation') as string), CURRENCY),
    automatic_payment_methods: { enabled: true },
    currency: CURRENCY,
  })

  return { client_secret: paymentIntent.client_secret as string }
}
