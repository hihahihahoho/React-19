# Agent Skills Specification

Summary of the agentskills.io specification for skill authoring.

Source: https://agentskills.io/specification

## Directory Structure

```
skill-name/
├── SKILL.md          # Required: main instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: detailed documentation
└── assets/           # Optional: templates, resources
```

## SKILL.md Format

### Frontmatter (Required)

```yaml
---
name: skill-name
description: What this skill does and when to use it.
---
```

### Frontmatter Fields

| Field           | Required | Constraints                             |
| --------------- | -------- | --------------------------------------- |
| `name`          | Yes      | Max 64 chars, lowercase, hyphens only   |
| `description`   | Yes      | Max 1024 chars, non-empty               |
| `license`       | No       | License name or file reference          |
| `compatibility` | No       | Max 500 chars, environment requirements |
| `metadata`      | No       | Key-value mapping for additional data   |

### Name Rules

- 1-64 characters
- Lowercase alphanumeric and hyphens only
- No leading/trailing hyphens
- No consecutive hyphens
- Must match parent directory name

### Description Best Practices

- Describe what the skill does
- Describe when to use it (trigger keywords)
- Include specific keywords for task matching

**Good:**

```yaml
description: Extracts text from PDF files, fills forms, merges documents. Use when working with PDF documents or when the user mentions PDFs.
```

**Bad:**

```yaml
description: Helps with PDFs.
```

## Body Content

No format restrictions. Recommended sections:

- Step-by-step instructions
- Examples of inputs and outputs
- Common edge cases

## Optional Directories

### scripts/

Executable code for agents to run:

- Self-contained or documented dependencies
- Helpful error messages
- Edge case handling

### references/

Additional documentation loaded on demand:

- `REFERENCE.md` - Detailed technical reference
- Domain-specific files
- Keep files focused and small

### assets/

Static resources:

- Templates
- Images/diagrams
- Data files/schemas

## Progressive Disclosure

Structure for efficient context usage:

1. **Metadata** (~100 tokens) - Loaded at startup for all skills
2. **Instructions** (<5000 tokens) - Loaded when skill is activated
3. **Resources** (as needed) - Loaded only when required

### Guidelines

- Keep SKILL.md under 500 lines
- Move detailed reference to separate files
- Keep file references one level deep
- Avoid deeply nested reference chains

## File References

Use relative paths from skill root:

```markdown
See [the reference guide](references/REFERENCE.md) for details.

Run the script: scripts/extract.py
```

## Validation

Validate skills with the reference library:

```bash
skills-ref validate ./my-skill
```
