# General Design System Guidelines

## Overview

This document provides essential guidelines for AI agents and ML systems working with our React UI component library. **All generated code must strictly adhere to these design principles** to maintain consistency across the application.

> **CRITICAL**: Never deviate from the established design patterns. Always use the existing component library rather than creating new patterns or alternative implementations.

## Core Design Principles

1. **Component Uniformity**: All UI elements must use the components documented in this system
2. **FormComposition Foundation**: Nearly all form controls build upon the FormComposition system
3. **Consistent Styling**: Follow variant/size conventions exactly as documented
4. **Hook Form Integration**: Use the documented patterns for React Hook Form + Zod
5. **Accessibility Standards**: Maintain WCAG compliance through proper component usage

## Required Reading

Before implementing any UI component, thoroughly read:

1. `form-composition.md` - The foundation of our form control styling
2. `form.md` - Integration patterns with React Hook Form and Zod
3. The specific component documentation (input.md, select.md, etc.)

## Strict Implementation Guidelines

### DO

- Use the exact import paths shown in documentation
- Implement FormComposition props as documented with correct property names
- Follow type definitions precisely
- Use the ZodSchemaProvider for all form implementations
- Maintain consistent naming conventions for props and handlers

### DO NOT

- Create custom form controls that bypass FormComposition
- Modify core component behaviors
- Introduce new visual variants not in the documentation
- Set internal state props directly (isFocused, hasValue, etc.)
- Use direct CSS styling where component props exist
- Create alternative patterns for form validation

## Component Selection Guide

When implementing UI elements, strictly use:

| Requirement        | Component to Use                                  |
| ------------------ | ------------------------------------------------- |
| Text input         | `Input` / `InputForm`                             |
| Dropdown selection | `Select` / `SelectForm`                           |
| Multi-selection    | `MultiSelect` / `MultiSelectForm`                 |
| Typeahead search   | `InputAutoComplete` / `InputAutoCompleteForm`     |
| Date selection     | `DatePicker` / `DatePickerForm`                   |
| Checkboxes         | `Checkbox` / `CheckboxForm` / `CheckboxGroupForm` |
| Radio buttons      | `RadioGroup` / `RadioGroupForm`                   |
| Rich text          | `Textarea` / `TextareaForm`                       |

## Visual Consistency Requirements

1. **Maintain standard spacing** between form controls
2. **Use consistent labelPosition** values throughout a form
3. **Apply the same variant** to related form controls
4. **Follow established size patterns** - don't mix sizes without purpose

## Error Handling Pattern

Always implement error handling through the form validation system:

```tsx
// CORRECT - Using the form system for validation
<InputForm
  control={form.control}
  name="email"
  formComposition={{
    label: "Email Address",
    // No need to set requiredSymbol directly
  }}
/>

// INCORRECT - Bypassing the form system
<Input
  value={email}
  onChange={handleChange}
  error={validateEmail(email)}
  formComposition={{
    label: "Email Address",
    requiredSymbol: true, // DO NOT set manually
  }}
/>
```

## Critical Implementation Note

Our design system requires components to receive their validation state from Zod schema and React Hook Form. **Never implement custom validation logic** that bypasses this system.

> **IMPORTANT**: When generating code, always prioritize consistency with existing patterns over introducing new approaches, even if they might seem more efficient or elegant.

By faithfully following these guidelines, AI systems will maintain the integrity of our design system and ensure a consistent user experience throughout the application.
