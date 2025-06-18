import type { Difference } from 'microdiff'

import diff from 'microdiff'

export { diff }
export type { Difference }

export function diffApply<T = any>(data: T, differences: Difference[]): T {
  for (const difference of differences) {
    let current = data as any
    const lastIndex = difference.path.length - 1

    // Traverse the path until the second-to-last element
    for (let i = 0; i < lastIndex; i++) {
      current = current[difference.path[i]]
    }

    const lastKey = difference.path[lastIndex]

    switch (difference.type) {
      case 'CHANGE': {
        current[lastKey] = difference.value
        break
      }
      case 'CREATE': {
        current[lastKey] = difference.value
        break
      }
      case 'REMOVE': {
        delete current[lastKey]
        break
      }
    }
  }

  return data
}
