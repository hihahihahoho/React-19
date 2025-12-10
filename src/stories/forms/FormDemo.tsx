import { Button } from "@/components/ui/button"
import { DateRangePickerForm } from "@/components/ui/date-range-picker/date-range-picker-form"
import { DatePickerForm } from "@/components/ui/datepicker/datepicker-form"
import { FileUploadForm } from "@/components/ui/file-upload/file-upload-form"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import {
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { InputOTPForm } from "@/components/ui/input-otp-form"
import { InputAutoCompleteForm } from "@/components/ui/input/input-auto-complete-form"
import { InputForm } from "@/components/ui/input/input-form"
import { InputNumberForm } from "@/components/ui/input/input-number-form"
import { MultiSelectForm } from "@/components/ui/select/multiselect-form"
import { SelectForm } from "@/components/ui/select/select-form"
import { CheckboxForm } from "@/components/ui/selection-controls/checkbox-form"
import {
  CheckboxGroupForm,
  ItemCheckboxType,
} from "@/components/ui/selection-controls/checkbox-group-form"
import {
  ItemRadioType,
  RadioGroupForm,
} from "@/components/ui/selection-controls/radio-group-form"
import { TextareaForm } from "@/components/ui/textarea/textarea-form"
import {
  ACCEPTED_PDF_TYPES,
  ACCEPTED_VIDEO_TYPES,
  FORMAT_DATE,
  MAX_FILE_SIZE,
} from "@/lib/const"
import { createRemoteFileProxy } from "@/lib/utils-plus"
import { zodDate, zodDateRange, zodFile } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addYears, parse } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"

const itemsCheckbox: ItemCheckboxType[] = [
  {
    value: "recents",
    label: "Recents",
  },
  {
    value: "home",
    label: "Home",
  },
  {
    value: "applications",
    label: "Applications",
  },
  {
    value: "desktop",
    label: "Desktop",
  },
  {
    value: "downloads",
    label: "Downloads",
  },
  {
    value: "documents",
    label: "Documents",
    disabled: true,
  },
] as const

const itemsRadioGroup: ItemRadioType[] = [
  {
    value: "include",
    label: "Bao gồm",
  },
  {
    value: "exclude",
    label: "Loại trừ",
  },
]

const FormSchema = z
  .object({
    username: z.string({
      error: "Please enter username.",
    }),

    password: z.string({ error: "Please enter password." }).optional(),
    confirm_password: z.string({ error: "Please confirm password." }),
    otp: z.string().length(6, { message: "OTP must be 6 characters." }),
    money: z
      .number({
        error: "Please enter money.",
      })
      .gt(100000),
    textarea: z.string({ error: "Please enter a description." }).max(230),
    select: z.string({ error: "Please select an option." }),
    auto_complete: z.string({ error: "Please type to search." }),
    multi_select: z
      .array(z.string())
      .min(2, { error: "Select at least 2 options." }),
    datepicker: zodDate(),
    dob: zodDate({
      minDate: new Date("1920-01-01"),
      maxDate: addYears(new Date(), 1),
    }),
    daterange: zodDateRange({
      minDate: new Date("1920-01-01"),
      maxDate: addYears(new Date(), 1),
    }),
    file_upload_native: zodFile({
      accepted: ACCEPTED_PDF_TYPES,
      maxFileSize: MAX_FILE_SIZE,
      length: { min: 0, max: 1 },
    }).optional(),
    file_upload: zodFile({
      accepted: [...ACCEPTED_VIDEO_TYPES],
      maxFileSize: MAX_FILE_SIZE,
      length: { min: 1, max: 7 },
    }),
    checkbox_group: z
      .array(z.string())
      .min(2, { error: "Select at least 2 option." }),
    radio_group: z.enum(["include", "exclude"], {
      error: "You need to select a notification type.",
    }),
    checkbox_term: z.boolean().refine((val) => val === true, {
      error: "Please read and accept the terms and conditions",
    }),
  })
  // superRefine cho phép validate cross-field và thêm multiple errors
  // Zod 4: sử dụng code: "custom" (string) thay vì z.ZodIssueCode.custom (deprecated)
  .superRefine((data, ctx) => {
    // Validate password strength
    if (data.password) {
      if (data.password.length < 8) {
        ctx.addIssue({
          code: "custom",
          message: "Password must be at least 8 characters.",
          path: ["password"],
          input: data.password,
        })
      }
      if (!/[A-Z]/.test(data.password)) {
        ctx.addIssue({
          code: "custom",
          message: "Password must contain at least 1 uppercase letter.",
          path: ["password"],
          input: data.password,
        })
      }
      if (!/[a-z]/.test(data.password)) {
        ctx.addIssue({
          code: "custom",
          message: "Password must contain at least 1 lowercase letter.",
          path: ["password"],
          input: data.password,
        })
      }
      if (!/[0-9]/.test(data.password)) {
        ctx.addIssue({
          code: "custom",
          message: "Password must contain at least 1 number.",
          path: ["password"],
          input: data.password,
        })
      }
    }

    // Cross-field validation: Password matching
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirm_password"],
        input: data.confirm_password,
      })
    }
  })

function FormDemo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirm_password: "",
      money: 1000000,
      multi_select: ["honda", "chevrolet"],
      datepicker: new Date("2024-10-28"),
      dob: new Date("1995-10-24 18:00"),
      textarea: "This is a textarea",
      select: "pizza",
      daterange: {
        from: parse("24/10/2024", FORMAT_DATE, new Date()),
        to: new Date("2024-10-28"),
      },
      file_upload: [
        createRemoteFileProxy(
          "https://pbs.twimg.com/media/Gk58xZCWUAABX7L?format=jpg&name=large",
          1000000
        ),
      ],
      checkbox_group: ["recents", "home"],
      radio_group: "include",
      checkbox_term: false,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  const handleChangeInput = () => {
    form.setValue("username", "test('should first', () => { second })", {
      shouldValidate: true,
    })
  }

  const handleIncrease = () => {
    form.setValue("money", (form.getValues("money") || 0) + 1000, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <ZodSchemaProvider schema={FormSchema}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-[760px] space-y-6"
        >
          <InputForm
            control={form.control}
            name="username"
            type="text"
            autoComplete="true"
            formComposition={{
              inputClear: true,
              description: "This is a description",
              label: "Input",
              labelPosition: "horizontal",
              suffixOutside: (
                <Button onClick={handleChangeInput}>Button</Button>
              ),
            }}
          />

          {/* Demo superRefine: Password validation */}
          <InputForm
            control={form.control}
            name="password"
            type="password"
            placeholder="Enter password"
            formComposition={{
              label: "Password (superRefine)",
              labelPosition: "horizontal",
              description: "Min 8 chars, 1 uppercase, 1 lowercase, 1 number",
            }}
          />
          <InputForm
            control={form.control}
            name="confirm_password"
            type="password"
            placeholder="Confirm password"
            formComposition={{
              label: "Confirm Password",
              labelPosition: "horizontal",
              description: "Must match password above",
            }}
          />

          <InputOTPForm
            control={form.control}
            name="otp"
            maxLength={6}
            formComposition={{
              label: "OTP Code",
              description: "Enter 6-digit verification code",
              labelPosition: "horizontal",
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTPForm>
          <InputNumberForm
            control={form.control}
            name="money"
            placeholder="VND"
            autoComplete="true"
            formComposition={{
              inputClear: true,
              label: "Money",
              labelPosition: "horizontal",
              suffixOutside: (
                <Button iconOnly onClick={handleIncrease}>
                  +
                </Button>
              ),
              suffix: "VND",
            }}
          />
          <InputForm
            control={form.control}
            name="file_upload_native"
            type="file"
            formComposition={{
              inputClear: true,
              description: "This is a description",
              label: "Input",
              labelPosition: "horizontal",
              suffixOutside: <Button>Button</Button>,
            }}
          />
          <TextareaForm
            control={form.control}
            name="textarea"
            placeholder="Textarea"
            formComposition={{
              label: "Textarea",
              labelPosition: "horizontal",
            }}
          />
          <SelectForm
            control={form.control}
            name="select"
            options={[
              {
                label: "Pizza",
                value: "pizza",
                keywords: ["Tùng", "cheese", "tomato sauce"],
              },
              {
                label: "Salad",
                value: "salad",
                disabled: true,
              },
              {
                label: "Pasta",
                value: "pasta",
              },
              {
                label: "Burger",
                value: "burger",
              },
              {
                label: "Soup",
                value: "soup",
              },
              {
                label: "Sushi",
                value: "sushi",
              },
              {
                label: "Tacos",
                value: "tacos",
              },
            ]}
            formComposition={{
              inputClear: true,
              description: "This is a description",
              label: "Select",
              labelPosition: "horizontal",
              suffixOutside: <Button>Button</Button>,
            }}
          />
          <InputAutoCompleteForm
            control={form.control}
            name="auto_complete"
            options={[
              {
                label: "Pizza",
                value: "pizza",
                keywords: ["Tùng", "cheese", "tomato sauce"],
              },
              {
                label: "Salad",
                value: "salad",
                disabled: true,
              },
              {
                label: "Pasta",
                value: "pasta",
              },
              {
                label: "Burger",
                value: "burger",
              },
              {
                label: "Soup",
                value: "soup",
              },
              {
                label: "Sushi",
                value: "sushi",
              },
              {
                label: "Tacos",
                value: "tacos",
              },
            ]}
            formComposition={{
              inputClear: true,
              description: "This is a description",
              label: "Auto Complete",
              labelPosition: "horizontal",
              suffixOutside: <Button>Button</Button>,
            }}
          />
          <MultiSelectForm
            control={form.control}
            name="multi_select"
            options={[
              {
                label: "Rolls-Royce Phantom Extended Wheelbase",
                value: "rolls_royce_phantom_extended",
              },
              {
                label: "Honda",
                value: "honda",
              },
              {
                label: "Ford",
                value: "ford",
              },
              {
                label: "Chevrolet",
                value: "chevrolet",
              },
              {
                label: "Nissan",
                value: "nissan",
              },
              {
                label: "BMW",
                value: "bmw",
              },
              {
                label: "Mercedes-Benz",
                value: "mercedes_benz",
              },
            ]}
            placeholder="MultiSelect"
            formComposition={{
              label: "MultiSelect",
              labelPosition: "horizontal",
            }}
          />
          <DatePickerForm
            control={form.control}
            name="datepicker"
            formComposition={{
              label: "Datepicker",
              labelPosition: "horizontal",
            }}
          />
          <DatePickerForm
            control={form.control}
            name="dob"
            formComposition={{
              label: "Datepicker Editable",
              labelPosition: "horizontal",
            }}
            inputTime
            editable
          />
          <DateRangePickerForm
            control={form.control}
            name="daterange"
            formComposition={{
              label: "DateRangePicker",
              labelPosition: "horizontal",
            }}
          />
          <FileUploadForm
            control={form.control}
            name="file_upload"
            formComposition={{
              labelPosition: "horizontal",
              label: "File Upload",
            }}
          />

          <CheckboxGroupForm
            control={form.control}
            name="checkbox_group"
            selectionGroup={{
              variant: "card",
            }}
            formComposition={{
              label: "Checkboxes",
              labelPosition: "horizontal",
            }}
            className="grid-cols-1 gap-4 lg:grid-cols-2"
            items={itemsCheckbox}
          />
          <RadioGroupForm
            control={form.control}
            name="radio_group"
            formComposition={{
              label: "Radio",
              labelPosition: "horizontal",
            }}
            items={itemsRadioGroup}
          />
          <CheckboxForm control={form.control} name="checkbox_term">
            Tôi đã đọc và đồng ý với các điều khoản và điều kiện
          </CheckboxForm>

          <div className="flex gap-4">
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
}
export { FormDemo }
