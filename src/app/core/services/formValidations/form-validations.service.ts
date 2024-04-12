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
    const errors = control.errors;

    if (errors['required']) {
      messages.push('Username required');
    }
    if (errors['minLength']) {
      messages.push('Username minimium 3 characters')
    }

    return messages;
  }

  getEmailMessages(control: AbstractControl): string[] {
    if (!control.errors) return [];

    const messages: string[] = [];
    const errors = control.errors;

    if (errors['required']) {
      messages.push('Email required');
    }
    if (errors['emailInvalid']) {
      messages.push('Invalid email')
    }

    return messages;

  }
}
