import CheckoutForm from '@/app/stripe/components/CheckoutForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate with hosted Checkout | Next.js + TypeScript Example',
}

export default function DonatePage(): JSX.Element {
  return (
    <div className="page-container">
      <h1>Donate with hosted Checkout</h1>
      <p>Donate to our project 💖</p>
      <CheckoutForm uiMode="hosted" />
    </div>
  )
}
