import { Button } from "@/components/ui/button";
import { DateRangePickerForm } from "@/components/ui/date-range-picker/date-range-picker-form";
import { DatePickerForm } from "@/components/ui/datepicker/datepicker-form";
import { FileUploadForm } from "@/components/ui/file-upload/file-upload-form";
import { Form } from "@/components/ui/form/form";
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context";
import { InputNumberForm } from "@/components/ui/input-number/input-number-form";
import { InputAutoCompleteForm } from "@/components/ui/input/input-auto-complete-form";
import { InputForm } from "@/components/ui/input/input-form";
import { MultiSelectForm } from "@/components/ui/select/multiselect-form";
import { SelectForm } from "@/components/ui/select/select-form";
import { CheckboxForm } from "@/components/ui/selection-controls/checkbox-form";
import {
  CheckboxGroupForm,
  ItemCheckboxType,
} from "@/components/ui/selection-controls/checkbox-group-form";
import {
  ItemRadioType,
  RadioGroupForm,
} from "@/components/ui/selection-controls/radio-group-form";
import { TextareaForm } from "@/components/ui/textarea/textarea-form";
import { ACCEPTED_PDF_TYPES, FORMAT_DATE } from "@/lib/const";
import { zodDate, zodDateRange, zodFile, zodRequiredString } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_FILE_SIZE = 3000000; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

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
] as const;

const itemsRadioGroup: ItemRadioType[] = [
  {
    value: "include",
    label: "Bao gồm",
  },
  {
    value: "exclude",
    label: "Loại trừ",
  },
];

const FormSchema = z.object({
  username: zodRequiredString("Please enter your username."),
  money: z
    .number({
      required_error: "Please enter money.",
    })
    .gt(100000),
  textarea: zodRequiredString("Please enter a description.").max(100),
  select: zodRequiredString("Please select an option."),
  auto_complete: zodRequiredString("Please type to search."),
  multi_select: z
    .array(z.string())
    .min(2, { message: "Select at least 2 options." }),
  datepicker: zodDate(),
  dob: zodDate({
    minDate: new Date("1900-01-01"),
    maxDate: new Date(),
  }),
  daterange: zodDateRange({
    minDate: new Date("1900-01-01"),
    maxDate: new Date(),
  }).optional(),
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
  checkbox_group: z
    .array(z.string())
    .min(2, { message: "Select at least 2 option." }),
  radio_group: z.enum(["include", "exclude"], {
    required_error: "You need to select a notification type.",
  }),
  checkbox_term: z.boolean().refine((val) => val === true, {
    message: "Please read and accept the terms and conditions",
  }),
});

function FormDemo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "tungnt2",
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
        new File(
          [],
          "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg",
          {
            type: ACCEPTED_IMAGE_TYPES[0],
          }
        ),
      ],
      checkbox_group: ["recents", "home"],
      radio_group: "include",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  const handleChangeInput = () => {
    form.setValue("username", "test('should first', () => { second })", {
      shouldValidate: true,
    });
  };

  const handleIncrease = () => {
    form.setValue("money", (form.getValues("money") || 0) + 1000, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <ZodSchemaProvider schema={FormSchema}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-[760px] mx-auto"
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
                form.reset();
              }}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </ZodSchemaProvider>
  );
}
export { FormDemo };
