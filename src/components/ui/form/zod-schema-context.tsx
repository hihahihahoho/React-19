import React from "react"
import { z } from "zod"

type ZodSchemaContextValue = {
  schema: z.ZodObject<{
    [k: string]: z.ZodType
  }>
}

interface ZodSchemaProviderProps {
  schema: z.ZodObject<{
    [k: string]: z.ZodType
  }>
  children: React.ReactNode
}

const SchemaContext = React.createContext<ZodSchemaContextValue | null>(null)

const ZodSchemaProvider = ({ schema, children }: ZodSchemaProviderProps) => {
  return (
    <SchemaContext.Provider value={{ schema }}>
      {children}
    </SchemaContext.Provider>
  )
}

const useZodSchema = () => {
  const context = React.useContext(SchemaContext)

  if (!context) {
    throw new Error("useSchema must be used within a ZodSchemaProvider")
  }

  const getSchemaFromPath = <T extends z.ZodType = z.ZodType>(
    inputPath: string
  ): T => {
    const parts = inputPath.split(".")
    let currentSchema: z.ZodType = context.schema

    for (const part of parts) {
      // Check if we're dealing with an object schema
      if (currentSchema instanceof z.ZodObject) {
        currentSchema = currentSchema.shape[part]
      }
      // Check if we're dealing with an array schema and the part is a number
      else if (currentSchema instanceof z.ZodArray && !isNaN(Number(part))) {
        // For array items, we just need to get the element type
        // The index doesn't matter for schema definition
        currentSchema = currentSchema.element
      }
      // Handle nested arrays (array of objects) where we need to access a property after an index
      else if (currentSchema instanceof z.ZodArray) {
        currentSchema = currentSchema.element

        // If the element is an object and we're not at the end of the path,
        // we need to access the property of the array element
        if (currentSchema instanceof z.ZodObject) {
          currentSchema = currentSchema.shape[part]
        }
      }

      if (!currentSchema) {
        throw new Error(`Path ${inputPath} not found in schema`)
      }
    }

    // Create the result with the schema and optional description
    const result = currentSchema as unknown as T
    return result
  }

  return {
    schema: context.schema,
    getSchemaFromPath,
  }
}

export { useZodSchema, ZodSchemaProvider }
