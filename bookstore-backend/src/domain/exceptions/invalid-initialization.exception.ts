export class InvalidInitializationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInitializationException';
  }
}
