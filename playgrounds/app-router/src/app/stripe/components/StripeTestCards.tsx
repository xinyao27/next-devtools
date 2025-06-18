export default function StripeTestCards(): JSX.Element {
  return (
    <div className="test-card-notice">
      Use any of the{' '}
      <a
        href="https://stripe.com/docs/testing#cards"
        rel="noopener noreferrer"
        target="_blank"
      >
        Stripe test cards
      </a>{' '}
      for this demo, e.g.{' '}
      <div className="card-number">
        4242
        <span />
        4242
        <span />
        4242
        <span />
        4242
      </div>
      .
    </div>
  )
}
