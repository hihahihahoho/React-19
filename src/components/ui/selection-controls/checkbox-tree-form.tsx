import React from "react"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { CheckboxTree, CheckboxTreeItem, TreeNode } from "./checkbox-tree"

export interface CheckboxTreeFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  trees?: TreeNode[]
  formComposition?: FormCompositionProps
  renderNode?: (props: {
    node: TreeNode
    isChecked: boolean | "indeterminate"
    isExpanded: boolean
    hasChildren: boolean
    onCheckedChange: () => void
    onToggleExpand: () => void
    children: React.ReactNode
  }) => React.ReactNode
  renderContent?: (node: TreeNode, hasChildren: boolean) => React.ReactNode
}

const CheckboxTreeForm = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  trees = [],
  formComposition,
  renderNode,
  renderContent,
  ...props
}: CheckboxTreeFormProps<TFieldValues, TName>) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isOptional } = getSchemaFromPath(name)

  const defaultRenderNode = React.useCallback(
    (nodeProps: {
      node: TreeNode
      isChecked: boolean | "indeterminate"
      isExpanded: boolean
      hasChildren: boolean
      onCheckedChange: () => void
      onToggleExpand: () => void
      children: React.ReactNode
    }) => (
      <CheckboxTreeItem
        key={nodeProps.node.id}
        {...nodeProps}
        renderContent={renderContent}
      />
    ),
    [renderContent]
  )

  return (
    <FormField
      control={control}
      name={name}
      {...props}
      render={({ field }) => {
        const handleCheckedNodesChange = (checkedNodes: Set<string>) => {
          field.onChange(Array.from(checkedNodes))
        }

        const checkedNodesSet = new Set(field.value || [])

        return (
          <FormComposition
            requiredSymbol={!isOptional()}
            isMinHeight
            {...formComposition}
            variant="empty"
          >
            <CheckboxTree
              trees={trees}
              checkedNodes={checkedNodesSet}
              onCheckedNodesChange={handleCheckedNodesChange}
              renderNode={renderNode || defaultRenderNode}
            />
          </FormComposition>
        )
      }}
    />
  )
}

CheckboxTreeForm.displayName = "CheckboxTreeForm"

export { CheckboxTreeForm }
