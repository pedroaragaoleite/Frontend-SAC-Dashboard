import { AbstractControl, ValidatorFn } from "@angular/forms";


export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(control.value);
        // console.log(valid);

        if (!control.value) {
            return { 'emailRequired': 'Email is required' }
        }

        return valid ? null : { 'emailInvalid': 'Please insert a valid email' };
    }
}

export function userValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return { 'usernameRequired': 'Username is required' }
        }
        return null;
    }
}


export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return { 'passwordRequired': 'Password is required' };
        }
        if (control.value.length < 8) {
            return { 'passwordLength': 'Password should be at least 8 characters' };
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(control.value)) {
            return { 'passwordContent': 'Password must include uppercase, lowercase, and numeric characters' };
        }
        return null;
    };
}

export function selectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

        if (control.value === '' || control.value === 'Choose a role') {
            return { 'selectedRequired': 'Selection is required' };
        }
        return null
    }
}

export function phoneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const phoneRegex = /^[69][0-9]{8}$/;
        const valid = phoneRegex.test(control.value)

        if (!control.value) {
            return { 'phoneRequired': 'Phone is required' }
        }
        if (!valid) {
            return { 'phonePattern': 'Phone number invalid' }
        }
        return null
    }
}
export function postalCodeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const postalCodeRegex = /^[0-9]{5}$/;
        const valid = postalCodeRegex.test(control.value)

        if (!control.value) {
            return { 'postalCodeRequired': 'Postal code is required' }
        }
        if (!valid) {
            return { 'postalCodePattern': 'Postal code invalid' }
        }
        return null
    }
}