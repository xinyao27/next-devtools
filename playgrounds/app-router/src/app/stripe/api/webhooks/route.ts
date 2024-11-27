/* eslint-disable no-console */
import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import type { Stripe } from 'stripe'

export async function POST(req: Request) {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    // On error, log and return the error message.
    if (error! instanceof Error) console.log(error)
    console.log(`❌ Error message: ${errorMessage}`)
    return NextResponse.json({ message: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id)

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ]

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session
          console.log(`💰 CheckoutSession status: ${data.payment_status}`)
          break
        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`)
          break
        case 'payment_intent.succeeded':
          data = event.data.object as Stripe.PaymentIntent
          console.log(`💰 PaymentIntent status: ${data.status}`)
          break
        default:
          throw new Error(`Unhandled event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 })
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 })
}
