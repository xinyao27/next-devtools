import { formatAmountForDisplay } from '@/utils/stripe-helpers'

export default function CustomDonationInput({
  className,
  currency,
  max,
  min,
  name,
  onChange,
  step,
  value,
}: {
  className?: string
  currency: string
  max: number
  min: number
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  step: number
  value: number
}): JSX.Element {
  return (
    <label>
      Custom donation amount ({formatAmountForDisplay(min, currency)}-{formatAmountForDisplay(max, currency)}):
      <input
        className={className}
        max={max}
        min={min}
        name={name}
        onChange={onChange}
        step={step}
        type="range"
        value={value}
      />
    </label>
  )
}
