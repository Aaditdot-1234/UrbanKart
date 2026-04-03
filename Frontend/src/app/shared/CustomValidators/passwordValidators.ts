import { AbstractControl, ValidationErrors } from "@angular/forms";

export class PasswordValidators {
    static passwordStrength(control: AbstractControl): ValidationErrors | null {
        const password = control.value;
        if (!password) {
            return null;
        }
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

        return !passwordValid ? {
            passwordStrength: {
                hasUpperCase: hasUpperCase,
                hasLowerCase: hasLowerCase,
                hasNumber: hasNumber,
                hasSpecialChar: hasSpecialChar
            }
        } : null;
    }


    static matchPassword(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { matchPassword: true };
    }
}