import { format } from 'date-fns'

export function formatDate(value: Date | string | number) {
  return format(new Date(typeof value === 'number' ? value : `${value}`), 'LLL dd, y HH:mm:ss')
}
