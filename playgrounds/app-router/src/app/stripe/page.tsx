import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | Next.js + TypeScript Example',
}

export default function IndexPage(): JSX.Element {
  return (
    <ul className="card-list">
      <li>
        <Link className="card checkout-style-background" href="/stripe/donate-with-embedded-checkout">
          <h2 className="bottom">Donate with embedded Checkout</h2>
          <img src="/checkout-one-time-payments.svg" />
        </Link>
      </li>
      <li>
        <Link className="card checkout-style-background" href="/stripe/donate-with-checkout">
          <h2 className="bottom">Donate with hosted Checkout</h2>
          <img src="/checkout-one-time-payments.svg" />
        </Link>
      </li>
      <li>
        <Link className="card elements-style-background" href="/stripe/donate-with-elements">
          <h2 className="bottom">Donate with Elements</h2>
          <img src="/elements-card-payment.svg" />
        </Link>
      </li>
    </ul>
  )
}
