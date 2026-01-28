"use client"

import { cn } from "@/lib/utils"
import { Redo2, RotateCcw, Undo2 } from "lucide-react"
import * as React from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import SignaturePadLib from "signature_pad"
import { Button } from "../button"

// ============================================================================
// Types
// ============================================================================

export interface SignaturePadOptions {
  /** Minimum width of a line. Defaults to 0.5 */
  minWidth?: number
  /** Maximum width of a line. Defaults to 2.5 */
  maxWidth?: number
  /** Radius of a single dot. Defaults to minWidth */
  dotSize?: number
  /** Add the next point only if the previous one is farther than x pixels. Defaults to 5 */
  minDistance?: number
  /** Color used to clear the background. Empty string for transparent. Defaults to "rgba(0,0,0,0)" */
  backgroundColor?: string
  /** Color used to draw the lines. Defaults to "black" */
  penColor?: string
  /** Weight used to modify new velocity. Defaults to 0.7 */
  velocityFilterWeight?: number
  /** Callback when stroke begins */
  onBegin?: () => void
  /** Callback when stroke ends */
  onEnd?: () => void
}

export interface SignaturePadData {
  isEmpty: boolean
  dataUrl: string | null
  svg: string | null
  points: ReturnType<SignaturePadLib["toData"]> | null
}

export interface SignaturePadRef {
  /** Returns whether the canvas is empty */
  isEmpty: () => boolean
  /** Returns signature image as data URL */
  toDataURL: (type?: string, quality?: number) => string
  /** Returns signature as SVG string */
  toSVG: (options?: { includeBackgroundColor?: boolean }) => string
  /** Returns signature as array of point groups */
  toData: () => ReturnType<SignaturePadLib["toData"]>
  /** Loads signature from data URL */
  fromDataURL: (
    dataUrl: string,
    options?: {
      ratio?: number
      width?: number
      height?: number
      xOffset?: number
      yOffset?: number
    }
  ) => Promise<void>
  /** Loads signature from point groups */
  fromData: (
    data: ReturnType<SignaturePadLib["toData"]>,
    options?: { clear?: boolean }
  ) => void
  /** Clears the canvas */
  clear: () => void
  /** Unbinds all event handlers */
  off: () => void
  /** Rebinds all event handlers */
  on: () => void
  /** Undo last stroke */
  undo: () => void
  /** Redo last undone stroke */
  redo: () => void
  /** Returns whether undo is possible */
  canUndo: () => boolean
  /** Returns whether redo is possible */
  canRedo: () => boolean
  /** Access the underlying SignaturePad instance */
  getSignaturePad: () => SignaturePadLib | null
}

// ============================================================================
// Context
// ============================================================================

interface SignaturePadContextType {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  isEmpty: boolean
  canUndo: boolean
  canRedo: boolean
  disabled: boolean
  readonly: boolean
  clear: () => void
  undo: () => void
  redo: () => void
  getData: () => SignaturePadData
}

const SignaturePadContext = createContext<SignaturePadContextType | null>(null)

export function useSignaturePad() {
  const context = useContext(SignaturePadContext)
  if (!context) {
    throw new Error("useSignaturePad must be used within SignaturePadRoot")
  }
  return context
}

// ============================================================================
// SignaturePadRoot
// ============================================================================

export interface SignaturePadRootProps extends SignaturePadOptions {
  children: React.ReactNode
  className?: string
  /** Callback when signature changes */
  onSignatureChange?: (data: SignaturePadData) => void
  /** Initial data URL to load */
  defaultDataUrl?: string
  /** Initial points data to load */
  defaultData?: ReturnType<SignaturePadLib["toData"]>
  /** Disabled state */
  disabled?: boolean
  /** Readonly state */
  readonly?: boolean
  /** Reference to access signature pad methods */
  ref?: React.Ref<SignaturePadRef>
}

function SignaturePadRoot({
  children,
  className,
  onSignatureChange,
  defaultDataUrl,
  defaultData,
  disabled = false,
  readonly = false,
  ref,
  ...options
}: SignaturePadRootProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePadLib | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const historyRef = useRef<ReturnType<SignaturePadLib["toData"]>[]>([])
  const redoStackRef = useRef<ReturnType<SignaturePadLib["toData"]>[]>([])
  const padApiRef = useRef<SignaturePadRef | null>(null)
  const initializedRef = useRef(false)

  const updateState = useCallback(() => {
    if (!signaturePadRef.current) return

    const empty = signaturePadRef.current.isEmpty()
    setIsEmpty(empty)
    setCanUndo(historyRef.current.length > 0)
    setCanRedo(redoStackRef.current.length > 0)

    const data: SignaturePadData = {
      isEmpty: empty,
      dataUrl: empty ? null : signaturePadRef.current.toDataURL(),
      svg: empty ? null : signaturePadRef.current.toSVG(),
      points: empty ? null : signaturePadRef.current.toData(),
    }
    onSignatureChange?.(data)
  }, [onSignatureChange])

  const saveToHistory = useCallback(() => {
    if (!signaturePadRef.current) return
    const data = signaturePadRef.current.toData()
    if (data.length > 0) {
      historyRef.current.push(JSON.parse(JSON.stringify(data)))
      redoStackRef.current = []
    }
  }, [])

  const handleEndStroke = useCallback(() => {
    saveToHistory()
    updateState()
    options.onEnd?.()
  }, [saveToHistory, updateState, options])

  // Initialize SignaturePad when canvas is available
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || initializedRef.current) return

    // Handle high DPI screens
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(ratio, ratio)
    }

    const pad = new SignaturePadLib(canvas, {
      minWidth: options.minWidth ?? 0.5,
      maxWidth: options.maxWidth ?? 2.5,
      penColor: options.penColor ?? "black",
      backgroundColor: options.backgroundColor ?? "rgba(0,0,0,0)",
      velocityFilterWeight: options.velocityFilterWeight ?? 0.7,
      minDistance: options.minDistance ?? 5,
      dotSize: options.dotSize,
    })

    if (disabled || readonly) {
      pad.off()
    }

    pad.addEventListener("beginStroke", () => {
      options.onBegin?.()
    })

    pad.addEventListener("endStroke", handleEndStroke)

    signaturePadRef.current = pad
    initializedRef.current = true

    // Load initial data
    if (defaultDataUrl) {
      pad.fromDataURL(defaultDataUrl).then(() => {
        updateState()
      })
    } else if (defaultData) {
      pad.fromData(defaultData)
      updateState()
    }

    // Handle resize
    const handleResize = () => {
      if (!canvas || !signaturePadRef.current) return
      const data = signaturePadRef.current.toData()
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.scale(ratio, ratio)
      }
      signaturePadRef.current.clear()
      if (data.length > 0) {
        signaturePadRef.current.fromData(data)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      pad.off()
      initializedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update pad state when disabled/readonly changes
  useEffect(() => {
    if (!signaturePadRef.current) return
    if (disabled || readonly) {
      signaturePadRef.current.off()
    } else {
      signaturePadRef.current.on()
    }
  }, [disabled, readonly])

  const clear = useCallback(() => {
    if (!signaturePadRef.current || disabled || readonly) return
    signaturePadRef.current.clear()
    historyRef.current = []
    redoStackRef.current = []
    updateState()
  }, [disabled, readonly, updateState])

  const undo = useCallback(() => {
    if (
      !signaturePadRef.current ||
      historyRef.current.length === 0 ||
      disabled ||
      readonly
    )
      return

    const currentData = signaturePadRef.current.toData()
    redoStackRef.current.push(JSON.parse(JSON.stringify(currentData)))
    historyRef.current.pop()

    signaturePadRef.current.clear()
    if (historyRef.current.length > 0) {
      const lastData = historyRef.current[historyRef.current.length - 1]
      signaturePadRef.current.fromData(lastData)
    }

    updateState()
  }, [disabled, readonly, updateState])

  const redo = useCallback(() => {
    if (
      !signaturePadRef.current ||
      redoStackRef.current.length === 0 ||
      disabled ||
      readonly
    )
      return

    const dataToRestore = redoStackRef.current.pop()
    if (dataToRestore) {
      signaturePadRef.current.clear()
      signaturePadRef.current.fromData(dataToRestore)
      historyRef.current.push(JSON.parse(JSON.stringify(dataToRestore)))
    }

    updateState()
  }, [disabled, readonly, updateState])

  const getData = useCallback((): SignaturePadData => {
    if (!signaturePadRef.current) {
      return { isEmpty: true, dataUrl: null, svg: null, points: null }
    }
    const empty = signaturePadRef.current.isEmpty()
    return {
      isEmpty: empty,
      dataUrl: empty ? null : signaturePadRef.current.toDataURL(),
      svg: empty ? null : signaturePadRef.current.toSVG(),
      points: empty ? null : signaturePadRef.current.toData(),
    }
  }, [])

  // Create API reference
  padApiRef.current = {
    isEmpty: () => signaturePadRef.current?.isEmpty() ?? true,
    toDataURL: (type?: string, quality?: number) =>
      signaturePadRef.current?.toDataURL(type, quality) ?? "",
    toSVG: (opts?: { includeBackgroundColor?: boolean }) =>
      signaturePadRef.current?.toSVG(opts) ?? "",
    toData: () => signaturePadRef.current?.toData() ?? [],
    fromDataURL: async (dataUrl: string, opts) => {
      await signaturePadRef.current?.fromDataURL(dataUrl, opts)
      saveToHistory()
      updateState()
    },
    fromData: (data, opts) => {
      signaturePadRef.current?.fromData(data, opts)
      saveToHistory()
      updateState()
    },
    clear,
    off: () => signaturePadRef.current?.off(),
    on: () => signaturePadRef.current?.on(),
    undo,
    redo,
    canUndo: () => historyRef.current.length > 0,
    canRedo: () => redoStackRef.current.length > 0,
    getSignaturePad: () => signaturePadRef.current,
  }

  useImperativeHandle(ref, () => padApiRef.current!)

  const contextValue: SignaturePadContextType = {
    canvasRef,
    isEmpty,
    canUndo,
    canRedo,
    disabled,
    readonly,
    clear,
    undo,
    redo,
    getData,
  }

  return (
    <SignaturePadContext.Provider value={contextValue}>
      <div
        className={cn(
          "signature-pad-root flex flex-col gap-2",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        {children}
      </div>
    </SignaturePadContext.Provider>
  )
}

// ============================================================================
// SignaturePadCanvas
// ============================================================================

export interface SignaturePadCanvasProps extends React.ComponentProps<"div"> {
  /** Canvas height */
  height?: number | string
  /** Placeholder text when empty */
  placeholder?: React.ReactNode
  /** Show grid lines */
  showGrid?: boolean
  /** Grid line color */
  gridColor?: string
}

function SignaturePadCanvas({
  className,
  height = 200,
  placeholder,
  showGrid = false,
  gridColor = "rgba(0,0,0,0.05)",
  style,
  children,
  ...props
}: SignaturePadCanvasProps) {
  const { isEmpty, canvasRef, disabled, readonly } = useSignaturePad()

  return (
    <div
      className={cn(
        "signature-pad-canvas-container border-input bg-background relative overflow-hidden rounded-lg border",
        className
      )}
      style={{ height, ...style }}
      {...props}
    >
      {showGrid && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
      )}
      {isEmpty && placeholder && (
        <div className="text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center text-sm">
          {placeholder}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 h-full w-full touch-none",
          (disabled || readonly) && "pointer-events-none"
        )}
      />
      {children}
    </div>
  )
}

// ============================================================================
// SignaturePadClearButton
// ============================================================================

export type SignaturePadClearButtonProps = React.ComponentProps<typeof Button>

function SignaturePadClearButton({
  children,
  ...props
}: SignaturePadClearButtonProps) {
  const { clear, isEmpty, disabled, readonly } = useSignaturePad()

  if (readonly) return null

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={clear}
      disabled={isEmpty || disabled}
      {...props}
    >
      {children ?? (
        <>
          <RotateCcw /> Clear
        </>
      )}
    </Button>
  )
}

// ============================================================================
// SignaturePadUndoButton
// ============================================================================

export type SignaturePadUndoButtonProps = React.ComponentProps<typeof Button>

function SignaturePadUndoButton({
  children,
  ...props
}: SignaturePadUndoButtonProps) {
  const { undo, canUndo, disabled, readonly } = useSignaturePad()

  if (readonly) return null

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={undo}
      iconOnly
      disabled={!canUndo || disabled}
      {...props}
    >
      {children ?? <Undo2 />}
    </Button>
  )
}

// ============================================================================
// SignaturePadRedoButton
// ============================================================================

export type SignaturePadRedoButtonProps = React.ComponentProps<typeof Button>

function SignaturePadRedoButton({
  children,
  ...props
}: SignaturePadRedoButtonProps) {
  const { redo, canRedo, disabled, readonly } = useSignaturePad()

  if (readonly) return null

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={redo}
      iconOnly
      disabled={!canRedo || disabled}
      {...props}
    >
      {children ?? <Redo2 />}
    </Button>
  )
}

// ============================================================================
// SignaturePadPreview
// ============================================================================

export interface SignaturePadPreviewProps extends React.ComponentProps<"img"> {
  /** Show when empty */
  emptyContent?: React.ReactNode
}

function SignaturePadPreview({
  className,
  emptyContent,
  ...props
}: SignaturePadPreviewProps) {
  const { getData, isEmpty } = useSignaturePad()
  const data = getData()

  if (isEmpty) {
    return emptyContent ? <>{emptyContent}</> : null
  }

  return (
    <img
      src={data.dataUrl ?? undefined}
      alt="Signature preview"
      className={cn("signature-pad-preview", className)}
      {...props}
    />
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  SignaturePadCanvas,
  SignaturePadClearButton,
  SignaturePadPreview,
  SignaturePadRedoButton,
  SignaturePadRoot,
  SignaturePadUndoButton,
}
