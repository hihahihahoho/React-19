export const getNodeText = (node: React.ReactNode): string => {
  if (node == null) return ""

  switch (typeof node) {
    case "string":
    case "number":
      return node.toString()

    case "boolean":
      return ""

    case "object": {
      if (node instanceof Array) return node.map(getNodeText).join("")

      if (node !== null && typeof node === "object" && "props" in node) {
        const reactElement = node as { props: { children?: React.ReactNode } }
        return getNodeText(reactElement.props.children)
      }

      return ""
    }

    default:
      console.warn("Unresolved `node` of type:", typeof node, node)
      return ""
  }
}
