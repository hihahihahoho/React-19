---
name: write-component-skill
description: Create skills for React UI component libraries. Use when documenting component registries for AI agents.
---

# Write Component Skill

> Create simple, concise skills that point to existing documentation.

## Key Principle

**Don't duplicate documentation.** Your component library likely already has:

- `llms.txt` for AI-readable component list
- Storybook stories for usage examples
- TypeScript types for props

A skill should **point to these resources** and add **decision-making guidance** only.

## Skill Structure

```
my-component-lib/
├── SKILL.md              # Simple and concise
└── references/           # Optional: rules and patterns
```

## SKILL.md Template

```markdown
---
name: my-lib
description: Brief description. Use when [trigger keywords].
---

# [Library Name]

> One-line description.

## When to Use

- [Trigger scenario 1]
- [Trigger scenario 2]

## Documentation

- Component list: `[url-to-llms.txt]`
- Examples: `[path-to-stories]`

## Installation

\`\`\`bash
npx shadcn@latest add [registry-url]/[component].json
\`\`\`

## Quick Reference

| Need       | Use         |
| ---------- | ----------- |
| [Use case] | `Component` |

## Key Patterns

[1-2 most important patterns with minimal code]

## Do/Don't

- Do [correct usage]
- Don't [common mistake]
```

## Guidelines

1. **Keep it under 100 lines** - agents can read full docs elsewhere
2. **Point to llms.txt** - it has component descriptions and install commands
3. **Point to stories** - they have real usage examples
4. **Focus on decisions** - when to use what component
5. **Minimal code** - just patterns, not full examples

## Example: Form Components

**Bad (too verbose):**

```markdown
### InputForm

InputForm is a form-bound input component that integrates with
React Hook Form and Zod validation. It accepts control, name,
and formComposition props...

[50+ lines of props documentation]
[Multiple code examples]
```

**Good (concise):**

```markdown
## Forms

Component list: `https://react-19.octung112.workers.dev/llms.txt`
Examples: `src/stories/input.stories.tsx`

| Need               | Use              |
| ------------------ | ---------------- |
| Text input in form | `InputForm`      |
| Select in form     | `SelectForm`     |
| Date in form       | `DatePickerForm` |

Key pattern: All `*Form` components take `control`, `name`, `formComposition`.
```
