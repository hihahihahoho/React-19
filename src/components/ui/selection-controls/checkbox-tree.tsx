import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import React, { useCallback, useMemo, useState } from "react"
import { Checkbox } from "./checkbox"

export interface TreeNode {
  id: string
  label: string
  defaultChecked?: boolean
  defaultExpanded?: boolean
  children?: TreeNode[]
}

function useCheckboxTree(
  initialTrees: TreeNode[] = [],
  externalCheckedNodes?: Set<string>,
  onExternalChange?: (checkedNodes: Set<string>) => void
) {
  const initialCheckedNodes = useMemo(() => {
    if (externalCheckedNodes) return externalCheckedNodes

    const checkedSet = new Set<string>()
    const initializeCheckedNodes = (node: TreeNode) => {
      if (node.defaultChecked) {
        checkedSet.add(node.id)
      }
      node.children?.forEach(initializeCheckedNodes)
    }

    // Add safety check
    if (Array.isArray(initialTrees)) {
      initialTrees.forEach(initializeCheckedNodes)
    }
    return checkedSet
  }, [initialTrees, externalCheckedNodes])

  const initialExpandedNodes = useMemo(() => {
    const expandedSet = new Set<string>()
    const initializeExpandedNodes = (node: TreeNode) => {
      // Default to expanded if defaultExpanded is true or not specified for nodes with children
      if (node.children && node.defaultExpanded !== false) {
        expandedSet.add(node.id)
      }
      node.children?.forEach(initializeExpandedNodes)
    }

    // Add safety check
    if (Array.isArray(initialTrees)) {
      initialTrees.forEach(initializeExpandedNodes)
    }
    return expandedSet
  }, [initialTrees])

  const [internalCheckedNodes, setInternalCheckedNodes] =
    useState<Set<string>>(initialCheckedNodes)
  const [expandedNodes, setExpandedNodes] =
    useState<Set<string>>(initialExpandedNodes)

  const checkedNodes = externalCheckedNodes || internalCheckedNodes

  const isChecked = useCallback(
    (node: TreeNode): boolean | "indeterminate" => {
      if (!node.children) {
        return checkedNodes.has(node.id)
      }

      const childrenChecked = node.children.map((child) => isChecked(child))
      if (childrenChecked.every((status) => status === true)) {
        return true
      }
      if (
        childrenChecked.some(
          (status) => status === true || status === "indeterminate"
        )
      ) {
        return "indeterminate"
      }
      return false
    },
    [checkedNodes]
  )

  const isExpanded = useCallback(
    (node: TreeNode): boolean => {
      return expandedNodes.has(node.id)
    },
    [expandedNodes]
  )

  const handleCheck = useCallback(
    (node: TreeNode) => {
      const newCheckedNodes = new Set(checkedNodes)

      const toggleNode = (n: TreeNode, check: boolean) => {
        if (check) {
          newCheckedNodes.add(n.id)
        } else {
          newCheckedNodes.delete(n.id)
        }
        n.children?.forEach((child) => toggleNode(child, check))
      }

      const currentStatus = isChecked(node)
      const newCheck = currentStatus !== true

      toggleNode(node, newCheck)

      if (onExternalChange) {
        onExternalChange(newCheckedNodes)
      } else {
        setInternalCheckedNodes(newCheckedNodes)
      }
    },
    [checkedNodes, isChecked, onExternalChange]
  )

  const handleToggleExpand = useCallback(
    (node: TreeNode) => {
      const newExpandedNodes = new Set(expandedNodes)

      if (expandedNodes.has(node.id)) {
        newExpandedNodes.delete(node.id)
      } else {
        newExpandedNodes.add(node.id)
      }

      setExpandedNodes(newExpandedNodes)
    },
    [expandedNodes]
  )

  return { isChecked, isExpanded, handleCheck, handleToggleExpand }
}

interface CheckboxTreeProps {
  trees?: TreeNode[]
  checkedNodes?: Set<string>
  onCheckedNodesChange?: (checkedNodes: Set<string>) => void
  renderNode: (props: {
    node: TreeNode
    isChecked: boolean | "indeterminate"
    isExpanded: boolean
    hasChildren: boolean
    onCheckedChange: () => void
    onToggleExpand: () => void
    children: React.ReactNode
  }) => React.ReactNode
}

export function CheckboxTree({
  trees = [],
  renderNode,
  checkedNodes,
  onCheckedNodesChange,
}: CheckboxTreeProps) {
  const { isChecked, isExpanded, handleCheck, handleToggleExpand } =
    useCheckboxTree(trees, checkedNodes, onCheckedNodesChange)

  const renderTreeNode = (node: TreeNode): React.ReactNode => {
    const nodeIsExpanded = isExpanded(node)
    const hasChildren = Boolean(node.children && node.children.length > 0)

    // Only render children if the node is expanded and has children
    const children = nodeIsExpanded && node.children?.map(renderTreeNode)

    return renderNode({
      node,
      isChecked: isChecked(node),
      isExpanded: nodeIsExpanded,
      hasChildren,
      onCheckedChange: () => handleCheck(node),
      onToggleExpand: () => handleToggleExpand(node),
      children,
    })
  }

  // Safety check for trees array
  if (!Array.isArray(trees) || trees.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">No items available</div>
    )
  }

  return <div className="space-y-1">{trees.map(renderTreeNode)}</div>
}

interface CheckboxTreeItemProps {
  node: TreeNode
  isChecked: boolean | "indeterminate"
  isExpanded: boolean
  hasChildren: boolean
  onCheckedChange: () => void
  onToggleExpand: () => void
  children: React.ReactNode
  renderContent?: (node: TreeNode, hasChildren: boolean) => React.ReactNode
}

export function CheckboxTreeItem({
  node,
  isChecked,
  isExpanded,
  hasChildren,
  onCheckedChange,
  onToggleExpand,
  children,
  renderContent,
}: CheckboxTreeItemProps) {
  return (
    <div
      key={node.id}
      className="grid w-full grid-cols-[auto_1fr] items-center gap-x-2"
    >
      {hasChildren ? (
        <button
          onClick={onToggleExpand}
          className="text-muted-foreground flex items-center justify-center rounded"
          aria-label={isExpanded ? "Collapse" : "Expand"}
          type="button"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      ) : (
        <div className="h-4 w-4" />
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheckedChange}
          isIndeterminate={isChecked === "indeterminate"}
        />

        <label
          className={cn("flex cursor-pointer items-center gap-2 py-1.5")}
          onClick={onCheckedChange}
        >
          {renderContent ? (
            renderContent(node, hasChildren)
          ) : (
            <>
              {/* {hasChildren ? (
                <FolderOpen className="text-muted-foreground" size={16} />
              ) : (
                <FileText className="text-muted-foreground" size={16} />
              )} */}

              {node.label}
            </>
          )}
        </label>
      </div>

      <div className="flex h-full justify-center">
        <div className="ml-0.25 h-full border-l"></div>
      </div>
      {hasChildren && isExpanded && <div className="">{children}</div>}
    </div>
  )
}
