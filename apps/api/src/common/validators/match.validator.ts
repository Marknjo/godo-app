import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  equals,
  registerDecorator,
} from 'class-validator'

/**
 * A matches decorator
 * @param property dto Key to compare with i.e. password vs passwordConfirm
 * @param options
 * @returns
 */
export const Match =
  <T>(property: keyof T, options?: ValidationOptions) =>
  (object: unknown, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [property],
      validator: MatchConstraint,
    })

/**
 * Handle comparison
 */
@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, validationArguments?: ValidationArguments): boolean {
    const dto = validationArguments.object
    const property = validationArguments.constraints.at(0)
    const compareWithValue = dto[property]

    return equals(compareWithValue, value)
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const [propertyNameToCompare] = validationArguments.constraints

    return `${propertyNameToCompare} and  ${validationArguments.property}  does not match`
  }
}
