import type { Stripe } from '@stripe/stripe-js'

/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { loadStripe } from '@stripe/stripe-js'

let stripePromise: Promise<null | Stripe>

export default function getStripe(): Promise<null | Stripe> {
  if (!stripePromise) stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

  return stripePromise
}
