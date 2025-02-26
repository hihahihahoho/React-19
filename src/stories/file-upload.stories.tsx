import { FileUpload } from "@/components/ui/file-upload/file-upload";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Base/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile file upload component that supports drag and drop, multiple file selection, and different display modes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Allow multiple file uploads",
      table: {
        type: { summary: "boolean" },
      },
    },
    buttonLabel: {
      control: "text",
      description: "Custom label for the upload button",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Upload files/images" },
      },
    },
    accept: {
      control: "object",
      description: "Array of accepted file types",
      table: {
        type: { summary: "string[]" },
        defaultValue: {
          summary: "['application/pdf', 'image/png', 'image/jpeg']",
        },
      },
    },
    display: {
      control: "radio",
      options: ["image", "chip"],
      description: "Display mode for uploaded files",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "chip" },
      },
    },
    maxFiles: {
      control: "number",
      description: "Maximum number of files allowed",
      table: {
        type: { summary: "number" },
      },
    },
    maxFileSize: {
      control: "number",
      description: "Maximum file size in MB",
      table: {
        type: { summary: "number" },
      },
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default file upload with chip display */
export const Default: Story = {
  args: {},
};

/** Image gallery display mode */
export const ImageGallery: Story = {
  args: {
    display: "image",
    accept: ["image/png", "image/jpeg"],
    buttonLabel: "Upload Images",
  },
};

/** PDF upload only */
export const PDFUpload: Story = {
  args: {
    accept: ["application/pdf"],
    buttonLabel: "Upload PDF",
    display: "chip",
    multiple: false,
  },
};

/** With pre-loaded files */
export const WithPreloadedFiles: Story = {
  args: {
    display: "image",
  },
};

/** Single file upload */
export const SingleFile: Story = {
  args: {
    multiple: false,
    maxFiles: 1,
    buttonLabel: "Upload Single File",
  },
};

/** Large file size limit */
export const LargeFiles: Story = {
  args: {
    maxFileSize: 10,
    buttonLabel: "Upload Large Files (up to 10MB)",
  },
};

/** Custom error display */
export const WithError: Story = {
  args: {
    maxFiles: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates error handling when trying to upload more files than allowed.",
      },
    },
  },
};

/** High resolution images */
export const HighResImages: Story = {
  args: {
    display: "image",
    accept: ["image/png", "image/jpeg"],
    maxFileSize: 5,
    buttonLabel: "Upload High-Res Images",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Configured for handling larger image files with increased size limit.",
      },
    },
  },
};
