import type { StateCreator } from 'zustand'

export interface SyncStoreOptions extends PubSubOptions {
  name: string
}
export interface PubSubOptions {
  pub: (payload: any, replace?: boolean, initial?: boolean) => Promise<any>
  sub: (
    listener: ({
      name,
      payload,
      replace,
      initial,
    }: {
      name: string
      payload: any
      replace?: boolean
      initial?: boolean
    }) => void,
  ) => void
}

export const syncStore =
  <T extends object>(initialStateCreator: StateCreator<T>, options: SyncStoreOptions): StateCreator<T> =>
  (_set, get, store) => {
    const _setState = (payload: T | Partial<T> | ((state: T) => T | Partial<T>) = get(), replace?: boolean) => {
      let data: T | Partial<T>
      const current = get()
      if (typeof payload === 'function') {
        data = (payload as (state: T) => T | Partial<T>)(current)
      } else {
        data = payload
      }
      options.pub(data, replace)
    }

    const originalSetState = store.setState
    store.setState = (payload: T | Partial<T> | ((state: T) => T | Partial<T>) = get(), replace?: boolean) => {
      _setState(payload, replace)
      return originalSetState(payload as T, false)
    }

    const set = (payload: T | Partial<T> | ((state: T) => T | Partial<T>) = get(), replace?: boolean) => {
      _setState(payload, replace)
      return _set(payload as T, false)
    }

    // Load initial state
    try {
      options.pub({}, false, true)
    } catch {
      /** */
    }

    options.sub(({ name, payload, replace, initial }) => {
      if (name !== options.name) return

      if (initial) {
        options.pub(get(), replace)
      } else _set(payload, false)
    })

    return initialStateCreator(set, get, store)
  }
