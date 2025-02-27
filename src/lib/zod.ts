import {
  differenceInDays,
  endOfDay,
  format,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
} from "date-fns";
import { z } from "zod";
import { FORMAT_DATE } from "./const";
import { formatFileSize } from "./file-size";

const zodRequiredString = (message = "Required") =>
  z.string({ required_error: message }).min(1, { message });

const zodFile = ({
  accepted,
  maxFileSize = 3000,
  length = { min: 1, max: 5 },
  required_error = "Vui lòng tải lên ít nhất 1 file.",
}: {
  accepted?: string[];
  maxFileSize?: number;
  length?: { min?: number; max?: number };
  required_error?: string;
} = {}) => {
  const describeObject = {
    accepted,
    maxFileSize,
    maxFiles: length.max,
  };
  let schema = z.custom<File[]>();

  const minLength = length?.min ?? 1; // Provide default value of 1 if undefined
  const maxLength = length?.max ?? 5; // Provide default value of 5 if undefined

  // Only apply the initial required validation if min length is not 0
  if (minLength !== 0) {
    schema = schema.refine((files) => {
      // If no files are provided, return true when min is 0
      if (!files || files.length === 0) {
        return minLength === 0;
      }
      return files.length >= 1;
    }, required_error);
  }

  // Additional length validations only apply when files are present
  if (minLength > 0) {
    schema = schema.refine((files) => {
      if (!files || files.length === 0) return true;
      return files.length >= minLength;
    }, `Bạn phải tải lên ít nhất ${minLength} file.`);
  }

  schema = schema.refine((files) => {
    if (!files || files.length === 0) return true;
    return files.length <= maxLength;
  }, `Bạn chỉ có thể tải lên tối đa ${maxLength} file.`);

  if (maxFileSize !== undefined) {
    schema = schema.refine((files) => {
      if (!files || files.length === 0) return true;
      return Array.from(files).every((file) => file.size <= maxFileSize);
    }, `Mỗi file phải nhỏ hơn ${formatFileSize(maxFileSize)}.`);
  }

  if (accepted && accepted.length > 0) {
    schema = schema.refine((files) => {
      if (!files || files.length === 0) return true;
      return Array.from(files).every((file) => accepted.includes(file.type));
    }, `Chỉ chấp nhận các file ${accepted.join(", ")}.`);
  }

  return schema.describe(JSON.stringify(describeObject));
};
const zodDate = ({
  minDate,
  maxDate,
  required_error = "Ngày là bắt buộc.",
  invalid_error = "Ngày không hợp lệ.",
  min_error,
  max_error,
}: {
  minDate?: Date;
  maxDate?: Date;
  required_error?: string;
  invalid_error?: string;
  min_error?: string;
  max_error?: string;
} = {}) => {
  const describeObject = {
    minDate: minDate,
    maxDate: maxDate,
  };
  // Create base schema
  let schema = z.date({
    required_error,
    invalid_type_error: invalid_error,
  });

  // Apply min date validation if provided
  if (minDate !== undefined) {
    schema = schema.min(
      startOfDay(minDate),
      min_error || `Ngày phải sau hoặc bằng ${format(minDate, FORMAT_DATE)}.`
    );
  }

  // Apply max date validation if provided
  if (maxDate !== undefined) {
    schema = schema.max(
      endOfDay(maxDate),
      max_error || `Ngày phải trước hoặc bằng ${format(maxDate, FORMAT_DATE)}.`
    );
  }

  // Return the schema with proper description
  return schema.describe(JSON.stringify(describeObject));
};

const zodDateRange = ({
  minDate,
  maxDate,
  required_error = "Ngày là bắt buộc.",
  invalid_error = "Ngày không hợp lệ.",
  min_error,
  max_error,
  minRange,
  maxRange,
}: {
  minDate?: Date;
  maxDate?: Date;
  required_error?: string;
  invalid_error?: string;
  min_error?: string;
  max_error?: string;
  minRange?: number; // Minimum range in days
  maxRange?: number; // Maximum range in days
} = {}) => {
  const describeObject = {
    minDate: minDate,
    maxDate: maxDate,
    minRange,
    maxRange,
  };
  const schema = z.object({
    from: z.date({ required_error, invalid_type_error: invalid_error }),
    to: z.date({ required_error, invalid_type_error: invalid_error }),
  });

  // Create all refinements as an array
  const refinements: Array<
    [(data: { from: Date; to: Date }) => boolean, { message: string }]
  > = [];

  // Add basic refinement for date order - compare only the date parts
  refinements.push([
    (data) => {
      if (!data.from || !data.to) return true;
      const fromDay = startOfDay(data.from);
      const toDay = startOfDay(data.to);
      return isEqual(fromDay, toDay) || isAfter(toDay, fromDay);
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu.",
    },
  ]);

  // Add min date validation if provided - compare only the date parts
  if (minDate !== undefined) {
    refinements.push([
      (data) => {
        if (!data.from) return true;
        const fromDay = startOfDay(data.from);
        const minDay = startOfDay(minDate);
        return isEqual(fromDay, minDay) || isAfter(fromDay, minDay);
      },
      {
        message:
          min_error || `Ngày bắt đầu phải sau ${minDate.toLocaleDateString()}.`,
      },
    ]);
  }

  // Add max date validation if provided - compare only the date parts
  if (maxDate !== undefined) {
    refinements.push([
      (data) => {
        if (!data.to) return true;
        const toDay = startOfDay(data.to);
        const maxDay = startOfDay(maxDate);
        return isEqual(toDay, maxDay) || isBefore(toDay, maxDay);
      },
      {
        message:
          max_error ||
          `Ngày kết thúc phải trước hoặc bằng ${format(maxDate, FORMAT_DATE)}.`,
      },
    ]);
  }

  // Add minimum range validation if provided
  // differenceInDays already ignores time components
  if (minRange !== undefined) {
    refinements.push([
      (data) => {
        if (!data.from || !data.to) return true;
        const days = differenceInDays(data.to, data.from);
        return days >= minRange;
      },
      {
        message: `Khoảng thời gian phải ít nhất ${minRange} ngày.`,
      },
    ]);
  }

  // Add maximum range validation if provided
  // differenceInDays already ignores time components
  if (maxRange !== undefined) {
    refinements.push([
      (data) => {
        if (!data.from || !data.to) return true;
        const days = differenceInDays(data.to, data.from);
        return days <= maxRange;
      },
      {
        message: `Khoảng thời gian không được quá ${maxRange} ngày.`,
      },
    ]);
  }

  // Apply all refinements
  return schema
    .superRefine((data, ctx) => {
      for (const [check, error] of refinements) {
        if (!check(data)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error.message,
          });
        }
      }
    })
    .describe(JSON.stringify(describeObject));
};

export { zodDate, zodDateRange, zodFile, zodRequiredString };

