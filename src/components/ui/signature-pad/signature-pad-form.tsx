"use client"

import { useRef } from "react"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { ButtonGroup } from "../button-group"
import {
  FormComposition,
  FormCompositionProps,
  FormControl,
  FormField,
} from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import {
  SignaturePadCanvas,
  SignaturePadCanvasProps,
  SignaturePadClearButton,
  SignaturePadData,
  SignaturePadRedoButton,
  SignaturePadRef,
  SignaturePadRoot,
  SignaturePadRootProps,
  SignaturePadUndoButton,
} from "./signature-pad"

// ============================================================================
// SignaturePad (Form integrated component)
// ============================================================================

export interface SignaturePadProps extends Omit<
  SignaturePadRootProps,
  "ref" | "children"
> {
  /** FormComposition props (label, description, etc) */
  formComposition?: FormCompositionProps
  /** Canvas props (height, placeholder, showGrid, etc) */
  canvas?: Omit<SignaturePadCanvasProps, "children">
  /** Reference to access signature pad methods */
  signaturePadRef?: React.Ref<SignaturePadRef>
}

function SignaturePad({
  signaturePadRef,
  formComposition,
  canvas,
  disabled,
  readonly,
  ...rootProps
}: SignaturePadProps) {
  return (
    <FormComposition
      {...formComposition}
      disabled={disabled}
      readonly={readonly}
      isMinHeight
      inputClear={false}
      variant="empty"
    >
      <FormControl>
        <div className="relative">
          <SignaturePadRoot
            ref={signaturePadRef}
            disabled={disabled}
            readonly={readonly}
            {...rootProps}
          >
            <SignaturePadCanvas
              height={200}
              placeholder="Ký tại đây"
              {...canvas}
            />
            {!readonly && (
              <ButtonGroup className="absolute top-2 right-2">
                <ButtonGroup>
                  <SignaturePadUndoButton />
                  <SignaturePadRedoButton />
                </ButtonGroup>
                <ButtonGroup>
                  <SignaturePadClearButton />
                </ButtonGroup>
              </ButtonGroup>
            )}
          </SignaturePadRoot>
        </div>
      </FormControl>
    </FormComposition>
  )
}

// ============================================================================
// SignaturePadForm (react-hook-form integrated)
// ============================================================================

export interface SignaturePadFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    ControllerProps<TFieldValues, TName>,
    Omit<SignaturePadProps, "defaultValue" | "name" | "onSignatureChange"> {
  /** Value type to store in form: 'dataUrl' | 'svg' | 'points' | 'full' */
  valueType?: "dataUrl" | "svg" | "points" | "full"
}

const SignaturePadForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  valueType = "dataUrl",
  ...props
}: Omit<SignaturePadFormProps<TFieldValues, TName>, "render">) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isRequired } = getSchemaFromPath(name)
  const signaturePadRef = useRef<SignaturePadRef>(null)

  return (
    <FormField
      name={name}
      render={({ field: { value, onChange } }) => {
        const handleSignatureChange = (data: SignaturePadData) => {
          if (data.isEmpty) {
            onChange(valueType === "full" ? data : null)
          } else {
            switch (valueType) {
              case "dataUrl":
                onChange(data.dataUrl)
                break
              case "svg":
                onChange(data.svg)
                break
              case "points":
                onChange(data.points)
                break
              case "full":
                onChange(data)
                break
            }
          }
        }

        // Determine default data based on value type
        const getDefaultData = (): Partial<
          Pick<SignaturePadProps, "defaultDataUrl" | "defaultData">
        > => {
          if (!value) return {}

          switch (valueType) {
            case "dataUrl":
              return { defaultDataUrl: value as string }
            case "svg":
              return {} // SVG can't be loaded back directly
            case "points":
              return {
                defaultData: value as ReturnType<SignaturePadRef["toData"]>,
              }
            case "full": {
              const fullValue = value as SignaturePadData
              if (fullValue.dataUrl) {
                return { defaultDataUrl: fullValue.dataUrl }
              }
              if (fullValue.points) {
                return { defaultData: fullValue.points }
              }
              return {}
            }
            default:
              return {}
          }
        }

        return (
          <SignaturePad
            {...props}
            {...getDefaultData()}
            signaturePadRef={signaturePadRef}
            onSignatureChange={handleSignatureChange}
            formComposition={{
              requiredSymbol: isRequired,
              ...props.formComposition,
            }}
          />
        )
      }}
    />
  )
}

export { SignaturePad, SignaturePadForm }
