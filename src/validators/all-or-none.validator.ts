import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export const allOrNoneRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if(control instanceof FormGroup){
    const group = control as FormGroup;
    const keys: string[] = Object.keys(group.controls);
    const valid: boolean = keys.every((key: string): boolean => !!group.controls[key].value || group.controls[key].value === 0) ||
      keys.every((key: string): boolean => !group.controls[key].value);
    return valid ? null : { allOrNoneRequired: true };
  }
  else {
    throw new TypeError("allOrNoneRequiredValidator should be applied to a FormGroup");
  }
};
