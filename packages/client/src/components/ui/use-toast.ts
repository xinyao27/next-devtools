// Inspired by react-hot-toast library
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  action?: ToastActionElement
  description?: React.ReactNode
  id: string
  title?: React.ReactNode
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
} as const

let count = 0

type Action =
  | {
      toast: Partial<ToasterToast>
      type: ActionType['UPDATE_TOAST']
    }
  | {
      toast: ToasterToast
      type: ActionType['ADD_TOAST']
    }
  | {
      toastId?: ToasterToast['id']
      type: ActionType['DISMISS_TOAST']
    }
  | {
      toastId?: ToasterToast['id']
      type: ActionType['REMOVE_TOAST']
    }

type ActionType = typeof actionTypes

interface State {
  toasts: ToasterToast[]
}

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }

    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }
  }
}

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      toastId,
      type: 'REMOVE_TOAST',
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

type Toast = Omit<ToasterToast, 'id'>

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      toast: { ...props, id },
      type: 'UPDATE_TOAST',
    })
  const dismiss = () => dispatch({ toastId: id, type: 'DISMISS_TOAST' })

  dispatch({
    toast: {
      ...props,
      id,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
      open: true,
    },
    type: 'ADD_TOAST',
  })

  return {
    dismiss,
    id,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index !== -1) listeners.splice(index, 1)
    }
  }, [state])

  return {
    ...state,
    dismiss: (toastId?: string) => dispatch({ toastId, type: 'DISMISS_TOAST' }),
    toast,
  }
}

export { toast, useToast }
