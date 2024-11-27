import { formatAmountForDisplay } from '@/utils/stripe-helpers'

export default function CustomDonationInput({
  name,
  min,
  max,
  currency,
  step,
  onChange,
  value,
  className,
}: {
  name: string
  min: number
  max: number
  currency: string
  step: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: number
  className?: string
}): JSX.Element {
  return (
    <label>
      Custom donation amount ({formatAmountForDisplay(min, currency)}-{formatAmountForDisplay(max, currency)}):
      <input
        className={className}
        max={max}
        min={min}
        name={name}
        step={step}
        type="range"
        value={value}
        onChange={onChange}
      />
    </label>
  )
}
