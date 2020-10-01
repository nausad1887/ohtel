import { AbstractControl } from '@angular/forms';

export function emailPresent(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (
    control.value !== undefined ||
    control.value !== null ||
    control.value !== ''
  ) {
    return { emailisPresent: true };
  }
  return null;
}

export function contactPresent(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (
    control.value === undefined ||
    control.value === null ||
    control.value === ''
  ) {
    return { contactpresent: true };
  }
  return null;
}

export function valueNot(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (
    control.value !== undefined ||
    control.value !== null ||
    control.value !== ''
  ) {
    return { notEmpty: true };
  }
  return null;
}
