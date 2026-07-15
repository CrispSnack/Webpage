import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = any // Minimal polyfill for the hook

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = {
  type: "ADD_TOAST" | "UPDATE_TOAST" | "DISMISS_TOAST" | "REMOVE_TOAST"
  toast?: ToasterToast
  toastId?: string
}

const toastListeners: Array<(state: any) => void> = []

let memoryState: any = { toasts: [] }

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action)
  toastListeners.forEach((listener) => listener(memoryState))
}

export function toast({ ...props }: any) {
  const id = genId()

  const update = (props: any) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

export function useToast() {
  const [state, setState] = React.useState<any>(memoryState)

  React.useEffect(() => {
    toastListeners.push(setState)
    return () => {
      const index = toastListeners.indexOf(setState)
      if (index > -1) {
        toastListeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

function reducer(state: any, action: ActionType): any {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t: any) =>
          t.id === action.toast?.id ? { ...t, ...action.toast } : t
        ),
      }
    case "DISMISS_TOAST": {
      const { toastId } = action
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t: any) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        }
      }
      return {
        ...state,
        toasts: state.toasts.map((t: any) => ({ ...t, open: false })),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t: any) => t.id !== action.toastId),
      }
  }
}
