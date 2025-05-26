export class BenefitServiceException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BenefitServiceException';
  }
}
