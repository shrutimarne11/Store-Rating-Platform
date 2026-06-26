import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordStrength', async: false })
export class PasswordStrengthConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (!password || password.length < 8 || password.length > 16) {
      return false;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    return hasUppercase && hasSpecial;
  }

  defaultMessage(): string {
    return 'Password must be 8-16 characters and include at least one uppercase letter and one special character';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordStrengthConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'nameLength', async: false })
export class NameLengthConstraint implements ValidatorConstraintInterface {
  validate(name: string): boolean {
    return typeof name === 'string' && name.length >= 20 && name.length <= 60;
  }

  defaultMessage(): string {
    return 'Name must be between 20 and 60 characters';
  }
}

export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: NameLengthConstraint,
    });
  };
}
