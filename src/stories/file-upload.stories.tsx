/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload/file-upload"
import { FileUploadForm } from "@/components/ui/file-upload/file-upload-form"
import { FileUploadList } from "@/components/ui/file-upload/file-upload-list"
import { FileUploadListForm } from "@/components/ui/file-upload/file-upload-list-form"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { createRemoteFileProxy } from "@/lib/utils-plus"
import { zodFile } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * FileUpload component allows users to upload files with preview functionality and validation.
 * Use it to collect files from users with support for drag and drop, preview, and file validation.
 */
const meta = {
  title: "Forms/File Upload",
  tags: ["refactor_story"],
  component: FileUpload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/file-upload.json
\`\`\`

\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/file-upload-list.json
\`\`\`

FileUpload component allows users to upload files with drag-and-drop functionality, file previews, and validation.

## Features
- Drag and drop file upload
- File previews for images
- Multiple file support
- File type validation
- File size validation
- Accessible form integration
- Grid and list display options

## When to use
- When users need to upload one or more files
- When you need to validate file types and sizes
- When you want to provide visual feedback for uploaded files
- When you need to integrate file uploads with forms
        `,
      },
    },
  },
  argTypes: {
    maxFiles: {
      control: { type: "number" },
      description: "Maximum number of files allowed to be uploaded",
    },
    accept: {
      description: "Array of accepted MIME types",
    },
    maxFileSize: {
      control: { type: "number" },
      description: "Maximum file size in bytes",
      table: {
        defaultValue: { summary: "500000 (500KB)" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables the file upload component",
    },
    buttonLabel: {
      control: "text",
      description: "Custom text for the upload button",
    },
    formComposition: {
      description: "Form composition props for integrating with form layouts",
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[600px] max-w-[80vw]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic file upload component with default configuration.
 */
export const Basic: Story = {
  args: {
    maxFiles: 5,
    accept: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    maxFileSize: 500000,
  },
  parameters: {
    docs: {
      description: {
        story: "Basic file upload component with default configuration.",
      },
    },
  },
}

/**
 * File upload component limited to a single file.
 */
export const SingleFileUpload: Story = {
  args: {
    maxFiles: 1,
    accept: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    maxFileSize: 500000,
  },
  parameters: {
    docs: {
      description: {
        story:
          "File upload component configured to accept only one file at a time.",
      },
    },
  },
}

/**
 * File upload component with custom accepted file types.
 */
export const CustomFileTypes: Story = {
  args: {
    accept: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFileSize: 1000000,
  },
  parameters: {
    docs: {
      description: {
        story:
          "File upload component configured to accept only PDF and Word documents.",
      },
    },
  },
}

/**
 * Disabled file upload component.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    maxFiles: 5,
    accept: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    maxFileSize: 500000,
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled file upload component that prevents user interaction.",
      },
    },
  },
}

/**
 * File upload component with form composition properties.
 */
export const WithFormComposition: Story = {
  args: {
    maxFiles: 3,
    accept: ["image/jpeg", "image/jpg", "image/png"],
    maxFileSize: 500000,
    formComposition: {
      label: "Upload Images",
      description: "Upload up to 3 images (JPEG, JPG, PNG formats only)",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "File upload component with form composition properties for better integration with form layouts.",
      },
    },
  },
}

/**
 * File upload component with form integration example using react-hook-form and zod validation.
 */
export const WithFormIntegration: Story = {
  render: () => {
    const MAX_FILE_SIZE = 3000000 // 3MB
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

    const formSchema = z.object({
      files: zodFile({
        accepted: ACCEPTED_IMAGE_TYPES,
        maxFileSize: MAX_FILE_SIZE,
        length: { min: 1, max: 3 },
      }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        files: [],
      },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
      console.log("Submitted files:", data.files)
      alert(`Submitted ${data.files.length} files`)
    }

    return (
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FileUploadForm
              control={form.control}
              name="files"
              formComposition={{
                label: "Upload Images",
                description: "Please upload at least one image (max 3)",
              }}
            />

            <div className="flex gap-4">
              <Button type="submit">Submit</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </ZodSchemaProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example showing how to integrate the FileUpload component with react-hook-form and zod validation.",
      },
    },
  },
}

/**
 * A comprehensive form example with multiple file upload fields.
 */
export const CompleteFormExample: Story = {
  render: () => {
    const MAX_FILE_SIZE = 3000000 // 3MB
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]
    const ACCEPTED_DOCUMENT_TYPES = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    const formSchema = z.object({
      profilePhoto: zodFile({
        accepted: ACCEPTED_IMAGE_TYPES,
        maxFileSize: MAX_FILE_SIZE,
        length: { min: 1, max: 1 },
      }),
      documents: zodFile({
        accepted: ACCEPTED_DOCUMENT_TYPES,
        maxFileSize: MAX_FILE_SIZE * 2,
        length: { min: 0, max: 5 },
      }).optional(),
      galleryImages: zodFile({
        accepted: ACCEPTED_IMAGE_TYPES,
        maxFileSize: MAX_FILE_SIZE,
        length: { min: 0, max: 10 },
      }).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        profilePhoto: [],
        documents: [],
        galleryImages: [],
      },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
      console.log("Form submitted:", data)
      alert("Form submitted successfully! Check console for details.")
    }

    return (
      <ZodSchemaProvider schema={formSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <FileUploadForm
              control={form.control}
              name="profilePhoto"
              maxFiles={1}
              formComposition={{
                label: "Profile Photo",
                description: "Upload a profile photo (JPEG, JPG, PNG only)",
                requiredSymbol: true,
              }}
            />

            <FileUploadListForm
              control={form.control}
              name="documents"
              formComposition={{
                label: "Documents",
                description:
                  "Upload supporting documents (PDF, DOC, DOCX only)",
                subDescription: "Optional",
              }}
            />

            <FileUploadForm
              control={form.control}
              name="galleryImages"
              formComposition={{
                label: "Gallery Images",
                description: "Upload additional images for your gallery",
                subDescription: "Optional",
              }}
            />

            <div className="flex gap-4">
              <Button type="submit">Submit Form</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.reset()}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </Form>
      </ZodSchemaProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive example showing multiple file upload fields in a single form with different configurations.",
      },
    },
  },
}

/**
 * File upload with predefined values, demonstrating how to handle existing files.
 */
export const WithPredefinedFiles: Story = {
  render: () => {
    // Create a sample file object for demonstration
    const sampleFile = createRemoteFileProxy(
      "https://pbs.twimg.com/media/Gk58xZCWUAABX7L?format=jpg&name=large",
      1000000
    )

    const samplePdf = createRemoteFileProxy(
      "https://pdfobject.com/pdf/sample.pdf",
      1000000,
      "application/pdf"
    )

    return (
      <div className="w-full space-y-6">
        <FileUpload
          defaultValue={[sampleFile]}
          maxFiles={1}
          formComposition={{
            label: "Profile Picture",
            description: "Change your profile picture",
          }}
        />

        <FileUploadList
          defaultValue={[samplePdf]}
          formComposition={{
            label: "Documents",
            description: "Your uploaded documents",
          }}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example showing file upload components with predefined values, demonstrating how to handle existing files.",
      },
    },
  },
}

/**
 * Form example similar to the FormDemo component in the project.
 */
export const FormDemoExample: Story = {
  render: () => {
    const MAX_FILE_SIZE = 3000000 // 3MB
    const ACCEPTED_IMAGE_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ]
    const ACCEPTED_PDF_TYPES = ["application/pdf"]

    // Define the schema similar to FormDemo.tsx
    const FormSchema = z.object({
      file_upload_native: zodFile({
        accepted: ACCEPTED_PDF_TYPES,
        maxFileSize: MAX_FILE_SIZE,
        length: { min: 0, max: 1 },
      }).optional(),
      file_upload: zodFile({
        accepted: ACCEPTED_IMAGE_TYPES,
        maxFileSize: MAX_FILE_SIZE,
        length: { min: 1, max: 5 },
      }),
    })

    // Setup the form with default values similar to FormDemo.tsx
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        file_upload: [
          createRemoteFileProxy(
            "https://pbs.twimg.com/media/Gk58xZCWUAABX7L?format=jpg&name=large",
            1000000
          ),
        ],
      },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
      console.log("Form data:", data)
      alert("Form submitted! Check console for details.")
    }

    return (
      <ZodSchemaProvider schema={FormSchema}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FileUploadForm
              control={form.control}
              name="file_upload"
              formComposition={{
                layout: {
                  leftColClass: "md:col-span-3 max-md:min-h-0",
                  rightColClass: "md:col-span-9",
                },
                label: "File Upload",
                labelPosition: "horizontal",
                description:
                  "Upload images or PDF files (max 5 files, 3MB each)",
              }}
            />

            <FileUploadListForm
              control={form.control}
              name="file_upload_native"
              formComposition={{
                layout: {
                  leftColClass: "md:col-span-3 max-md:min-h-0",
                  rightColClass: "md:col-span-9",
                },
                label: "PDF Upload",
                labelPosition: "horizontal",
                description: "Upload a PDF document (optional, max 3MB)",
                subDescription: "Optional",
              }}
            />

            <div className="flex justify-end gap-4">
              <Button type="submit">Submit</Button>
              <Button
                type="reset"
                variant="secondary"
                onClick={() => {
                  form.reset()
                }}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </Form>
      </ZodSchemaProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example matching the FormDemo component structure from the project, demonstrating file uploads in a form context.",
      },
    },
  },
}

/**
 * Display variants comparison showing grid and list views side by side.
 */
export const DisplayVariantsComparison: Story = {
  render: () => {
    // Create sample files
    const sampleFile1 = createRemoteFileProxy(
      "https://pbs.twimg.com/media/Gk58xZCWUAABX7L?format=jpg&name=large",
      1000000
    )

    const sampleFile2 = createRemoteFileProxy(
      "https://pdfobject.com/pdf/sample.pdf",
      1000000,
      "application/pdf"
    )

    const sampleFiles = [sampleFile1, sampleFile2]

    return (
      <div className="w-full space-y-8">
        <h3 className="text-lg font-medium">Grid Display</h3>
        <FileUpload
          defaultValue={sampleFiles}
          formComposition={{
            label: "Grid Display",
            description: "Files displayed in a grid layout",
          }}
        />

        <h3 className="mt-8 text-lg font-medium">List Display</h3>
        <FileUploadList
          defaultValue={sampleFiles}
          formComposition={{
            label: "List Display",
            description: "Files displayed in a list layout",
          }}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of grid and list display variants for the FileUpload component.",
      },
    },
  },
}
