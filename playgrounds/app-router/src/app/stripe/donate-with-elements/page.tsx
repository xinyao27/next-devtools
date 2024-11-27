import ElementsForm from '@/app/stripe/components/ElementsForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate with Elements',
}

export default function PaymentElementPage({
  searchParams,
}: {
  searchParams?: { payment_intent_client_secret?: string }
}): JSX.Element {
  return (
    <div className="page-container">
      <h1>Donate with Elements</h1>
      <p>Donate to our project 💖</p>
      <ElementsForm />
    </div>
  )
}
