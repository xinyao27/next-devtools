import { format } from 'date-fns'

export function formatDate(value: Date | number | string, options?: { format?: string }) {
  return format(new Date(typeof value === 'number' ? value : `${value}`), options?.format || 'LLL dd, y HH:mm:ss')
}
