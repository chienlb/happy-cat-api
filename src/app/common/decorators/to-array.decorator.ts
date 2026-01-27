import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, ValidationOptions } from 'class-validator';

type ToArrayOptions = {
  optional?: boolean;
  // nếu muốn ép mỗi phần tử về string
  mapToString?: boolean;
};

/**
 * Convert form-data value to array:
 * - undefined/null/'' => []
 * - array => array
 * - string JSON array => parsed array
 * - string normal => [string]
 * - other => [value]
 */
export function ToArray(
  opts: ToArrayOptions = { optional: true, mapToString: false },
  validationOptions?: ValidationOptions,
) {
  const { optional = true, mapToString = false } = opts;

  const transform = Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return [];

    let arr: any[];

    if (Array.isArray(value)) {
      arr = value;
    } else if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        arr = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        arr = [value];
      }
    } else {
      arr = [value];
    }

    return mapToString ? arr.map((x) => String(x)) : arr;
  });

  return applyDecorators(
    ...(optional ? [IsOptional(validationOptions)] : []),
    transform,
    IsArray(validationOptions),
  );
}
