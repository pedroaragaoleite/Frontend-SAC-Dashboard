import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationsService {

  constructor() { }

  getUsernameMessages(control: AbstractControl): string[] {
    if (!control.errors) return [];

    const messages: string[] = [];
    const usernameErrors = control.errors;

    if(usernameErrors['usernameRequired']){         
      messages.push(usernameErrors['usernameRequired']);
    }

    if (usernameErrors['minlength']) {      
      messages.push('Username minimium 3 characters')
    }
    return messages;
  }

  getEmailMessages(control: AbstractControl): string[] {
    if (!control.errors) return [];

    const messages: string[] = [];
    const emailErrors = control.errors;

       if (emailErrors['emailRequired']) {
      messages.push(emailErrors['emailRequired']);
    }

    
    if (emailErrors['emailInvalid']) {
      messages.push(emailErrors['emailInvalid'])
    }

 
    return messages;
  }

  getPasswordMessages(control: AbstractControl): string[] {
    if (!control.errors) return [];

    const messages: string[] = [];
    const passwordErrors = control.errors;

    if(passwordErrors['required']) {
      messages.push(passwordErrors['passwordRequired']);
    }

    if(passwordErrors['passwordLength']) {
      messages.push(passwordErrors['passwordLength'])
    }

    if(passwordErrors['passwordContent']) {
      messages.push(passwordErrors['passwordContent'])
    }
    return messages
  }

  getSelectMessages(control: AbstractControl): string[] {
    if (!control.errors) return [];

    const messages:string[] = [];
    const selectErrors = control.errors;
    console.log(selectErrors);
    

    if(selectErrors['selectedRequired']) {
      console.log(selectErrors);
      
      messages.push(selectErrors['selectedRequired'])
    }

    return messages;
  }
}
