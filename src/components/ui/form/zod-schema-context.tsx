import React from "react"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

type ZodSchemaContextValue = {
  schema: z.ZodType
}

interface ZodSchemaProviderProps {
  schema: z.ZodType
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

  const jsonSchemaFull = zodToJsonSchema(context.schema) as {
    properties: any
    required: string[]
  }

  const getJsonSchema = (
    inputPath: string
  ): Record<string, unknown> & {
    isRequired: boolean
  } => {
    const parts = inputPath.split(".")
    let currentSchema = jsonSchemaFull.properties
    let requiredFields = jsonSchemaFull.required

    for (let i = 0; i < parts.length; i++) {
      if (currentSchema && currentSchema[parts[i]]) {
        currentSchema = currentSchema[parts[i]]
        if (currentSchema.items?.properties) {
          requiredFields = currentSchema.items.required
          currentSchema = currentSchema.items.properties[parts[i + 2]]
        }
      }
    }

    return {
      isRequired: requiredFields.includes(parts[parts.length - 1]),
      description: currentSchema.description,
      ...currentSchema,
    }
  }

  return {
    schema: context.schema,
    jsonSchema: jsonSchemaFull,
    getJsonSchema: getJsonSchema,
  }
}

export { useZodSchema, ZodSchemaProvider }
