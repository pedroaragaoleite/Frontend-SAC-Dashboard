import { AbstractControl, ValidatorFn } from "@angular/forms";


export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const emailRegex = /^(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?<![_.-])$/;
        const valid = emailRegex.test(control.value);
        // console.log(valid);

        if(!control.value) {            
            return { 'emailRequired': 'Email is required' }
        }

        return valid ? null : { 'emailInvalid': 'Plese insert a valid email' };
    }
}

export function userValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if(!control.value) {            
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

export function selectValidator(): ValidatorFn{
    return (control: AbstractControl): { [key: string]: any } | null => {
        
        if (control.value === '' || control.value === 'Choose a role') {
            console.log(control.value);
            
            return { 'selectedRequired': 'Selection is required' };
        }
        return null
    }
}