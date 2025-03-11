// use-alert-dialog.tsx
"use client"

import { AlertDialogProps } from "@radix-ui/react-alert-dialog"
// Inspired by react-hot-toast library
import * as React from "react"

const ALERT_DIALOG_LIMIT = 1
const ALERT_DIALOG_REMOVE_DELAY = 5000 // Adjust as needed

type AlertDialog = Omit<AlertDialogProps, "title" | "description"> & {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode // Changed to React.ReactNode
  showCancel?: boolean // New prop to control the visibility of AlertDialogCancel
  open?: boolean
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = {
  ADD_ALERT_DIALOG: "ADD_ALERT_DIALOG"
  UPDATE_ALERT_DIALOG: "UPDATE_ALERT_DIALOG"
  DISMISS_ALERT_DIALOG: "DISMISS_ALERT_DIALOG"
  REMOVE_ALERT_DIALOG: "REMOVE_ALERT_DIALOG"
}

type Action =
  | {
      type: ActionType["ADD_ALERT_DIALOG"]
      dialog: AlertDialog
    }
  | {
      type: ActionType["UPDATE_ALERT_DIALOG"]
      dialog: Partial<AlertDialog> & { id: string }
    }
  | {
      type: ActionType["DISMISS_ALERT_DIALOG"]
      dialogId?: AlertDialog["id"]
    }
  | {
      type: ActionType["REMOVE_ALERT_DIALOG"]
      dialogId?: AlertDialog["id"]
    }

interface State {
  dialogs: AlertDialog[]
}

const dialogTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (
  dialogId: string,
  dispatch: React.Dispatch<Action>
) => {
  if (dialogTimeouts.has(dialogId)) {
    return
  }

  const timeout = setTimeout(() => {
    dialogTimeouts.delete(dialogId)
    dispatch({
      type: "REMOVE_ALERT_DIALOG",
      dialogId: dialogId,
    })
  }, ALERT_DIALOG_REMOVE_DELAY)

  dialogTimeouts.set(dialogId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ALERT_DIALOG":
      return {
        ...state,
        dialogs: [action.dialog, ...state.dialogs].slice(0, ALERT_DIALOG_LIMIT),
      }

    case "UPDATE_ALERT_DIALOG":
      return {
        ...state,
        dialogs: state.dialogs.map((d) =>
          d.id === action.dialog.id ? { ...d, ...action.dialog } : d
        ),
      }

    case "DISMISS_ALERT_DIALOG": {
      const { dialogId } = action

      if (dialogId) {
        addToRemoveQueue(dialogId, dispatch)
      } else {
        state.dialogs.forEach((dialog) => {
          addToRemoveQueue(dialog.id, dispatch)
        })
      }

      return {
        ...state,
        dialogs: state.dialogs.map((d) =>
          d.id === dialogId || dialogId === undefined
            ? {
                ...d,
                open: false,
              }
            : d
        ),
      }
    }

    case "REMOVE_ALERT_DIALOG":
      if (action.dialogId === undefined) {
        return {
          ...state,
          dialogs: [],
        }
      }
      return {
        ...state,
        dialogs: state.dialogs.filter((d) => d.id !== action.dialogId),
      }

    default:
      return state
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { dialogs: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type AlertDialogInput = Omit<AlertDialog, "id">

function showAlertDialog({ ...props }: AlertDialogInput) {
  const id = genId()

  const update = (props: AlertDialog) =>
    dispatch({
      type: "UPDATE_ALERT_DIALOG",
      dialog: { ...props, id },
    })

  const dismiss = () => dispatch({ type: "DISMISS_ALERT_DIALOG", dialogId: id })

  dispatch({
    type: "ADD_ALERT_DIALOG",
    dialog: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useAlertDialog() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    dialogs: state.dialogs,
    showAlertDialog,
    dismiss: (dialogId?: string) =>
      dispatch({ type: "DISMISS_ALERT_DIALOG", dialogId }),
  }
}

export { showAlertDialog as alertDialog, useAlertDialog }
