import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isbn', async: false })
export class IsbnConstraint implements ValidatorConstraintInterface {
  validate(isbn: string) {
    if (!isbn) return false;

    // Remove all non-digit characters except X (for ISBN-10 check digit)
    const cleanISBN = isbn.replace(/[^\dX]/gi, '');

    if (cleanISBN.length === 10) {
      return this.validateISBN10(cleanISBN);
    } else if (cleanISBN.length === 13) {
      return this.validateISBN13(cleanISBN);
    }

    return false;
  }

  private validateISBN10(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(isbn[i]) * (10 - i);
    }

    const checkDigit = isbn[9].toUpperCase();
    const calculatedCheck = (11 - (sum % 11)) % 11;
    const expectedCheck =
      calculatedCheck === 10 ? 'X' : calculatedCheck.toString();

    return checkDigit === expectedCheck;
  }

  private validateISBN13(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
    }

    const checkDigit = parseInt(isbn[12]);
    const calculatedCheck = (10 - (sum % 10)) % 10;

    return checkDigit === calculatedCheck;
  }

  defaultMessage() {
    return 'ISBN must be a valid ISBN-10 or ISBN-13 number';
  }
}

export function IsIsbn(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsbnConstraint,
    });
  };
}
